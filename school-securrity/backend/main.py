from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import supabase
from ai_service import analyze_incident


# =====================================================
# FASTAPI APPLICATION
# =====================================================

app = FastAPI(
    title="School Security Administration System",
    description="GenAI-powered school security management system",
    version="1.0.0"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://aaditi-three.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():
    return {
        "message": "School Security backend is running"
    }


# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/health")
def health():
    return {
        "status": "OK"
    }


# =====================================================
# SUPABASE DATABASE TEST
# =====================================================

@app.get("/db-test")
def database_test():

    try:

        response = (
            supabase
            .table("gates")
            .select("*")
            .limit(10)
            .execute()
        )

        return {
            "database": "connected",
            "gates": response.data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {str(e)}"
        )


# =====================================================
# VISITOR MANAGEMENT
# =====================================================

@app.post("/visitors")
def create_visitor(visitor: dict):

    try:

        # Required fields
        if not visitor.get("visitor_code"):
            raise HTTPException(
                status_code=400,
                detail="visitor_code is required"
            )

        if not visitor.get("full_name"):
            raise HTTPException(
                status_code=400,
                detail="full_name is required"
            )

        # Allowed verification statuses
        verification_status = visitor.get(
            "verification_status",
            "pending"
        )

        if verification_status not in [
            "pending",
            "verified",
            "rejected"
        ]:
            raise HTTPException(
                status_code=400,
                detail=(
                    "verification_status must be "
                    "pending, verified, or rejected"
                )
            )

        # Prepare database record
        record = {
            "visitor_code": visitor["visitor_code"],
            "full_name": visitor["full_name"],
            "phone": visitor.get("phone"),
            "id_type": visitor.get("id_type"),
            "id_number": visitor.get("id_number"),
            "purpose": visitor.get("purpose"),
            "person_to_meet": visitor.get("person_to_meet"),
            "organization": visitor.get("organization"),
            "verification_status": verification_status
        }

        response = (
            supabase
            .table("visitors")
            .insert(record)
            .execute()
        )

        return {
            "message": "Visitor registered successfully",
            "visitor": response.data
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to register visitor: {str(e)}"
        )


# =====================================================
# GET VISITORS
# =====================================================

@app.get("/visitors")
def get_visitors():

    try:

        response = (
            supabase
            .table("visitors")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "count": len(response.data),
            "visitors": response.data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve visitors: {str(e)}"
        )


# =====================================================
# ENTRY / EXIT MANAGEMENT
# =====================================================

@app.post("/entry-exit")
def record_entry_exit(log: dict):

    try:

        person_type = log.get("person_type")
        person_code = log.get("person_code")
        gate_id = log.get("gate_id")
        action = log.get("action")

        # -------------------------------------------------
        # Validate person type
        # -------------------------------------------------

        if person_type not in [
            "student",
            "staff",
            "visitor"
        ]:

            raise HTTPException(
                status_code=400,
                detail=(
                    "person_type must be "
                    "student, staff, or visitor"
                )
            )

        # -------------------------------------------------
        # Validate action
        # -------------------------------------------------

        if action not in [
            "entry",
            "exit"
        ]:

            raise HTTPException(
                status_code=400,
                detail="action must be entry or exit"
            )

        # -------------------------------------------------
        # Validate required values
        # -------------------------------------------------

        if not person_code:

            raise HTTPException(
                status_code=400,
                detail="person_code is required"
            )

        if not gate_id:

            raise HTTPException(
                status_code=400,
                detail="gate_id is required"
            )

        # -------------------------------------------------
        # IDs for person
        # -------------------------------------------------

        student_id = None
        staff_id = None
        visitor_id = None

        # -------------------------------------------------
        # STUDENT
        # -------------------------------------------------

        if person_type == "student":

            response = (
                supabase
                .table("students")
                .select(
                    "id, full_name, student_code"
                )
                .eq(
                    "student_code",
                    person_code
                )
                .execute()
            )

            if not response.data:

                raise HTTPException(
                    status_code=404,
                    detail="Student not found"
                )

            student_id = response.data[0]["id"]

        # -------------------------------------------------
        # STAFF
        # -------------------------------------------------

        elif person_type == "staff":

            response = (
                supabase
                .table("staff")
                .select(
                    "id, full_name, employee_code"
                )
                .eq(
                    "employee_code",
                    person_code
                )
                .execute()
            )

            if not response.data:

                raise HTTPException(
                    status_code=404,
                    detail="Staff member not found"
                )

            staff_id = response.data[0]["id"]

        # -------------------------------------------------
        # VISITOR
        # -------------------------------------------------

        elif person_type == "visitor":

            response = (
                supabase
                .table("visitors")
                .select(
                    "id, full_name, visitor_code"
                )
                .eq(
                    "visitor_code",
                    person_code
                )
                .execute()
            )

            if not response.data:

                raise HTTPException(
                    status_code=404,
                    detail="Visitor not found"
                )

            visitor_id = response.data[0]["id"]

        # -------------------------------------------------
        # CHECK GATE
        # -------------------------------------------------

        gate_response = (
            supabase
            .table("gates")
            .select("*")
            .eq("id", gate_id)
            .execute()
        )

        if not gate_response.data:

            raise HTTPException(
                status_code=404,
                detail="Gate not found"
            )

        gate = gate_response.data[0]

        # -------------------------------------------------
        # Create entry/exit record
        # -------------------------------------------------

        record = {
            "person_type": person_type,
            "student_id": student_id,
            "staff_id": staff_id,
            "visitor_id": visitor_id,
            "gate_id": gate_id,
            "action": action,
            "verified": log.get(
                "verified",
                False
            ),
            "notes": log.get("notes")
        }

        response = (
            supabase
            .table("entry_exit_logs")
            .insert(record)
            .execute()
        )

        return {
            "message": (
                f"{action.capitalize()} "
                "recorded successfully"
            ),
            "person_type": person_type,
            "person_code": person_code,
            "gate": gate["gate_name"],
            "action": action,
            "verified": record["verified"],
            "record": response.data
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to record entry/exit: "
                f"{str(e)}"
            )
        )


# =====================================================
# GET ENTRY / EXIT LOGS
# =====================================================

@app.get("/entry-exit")
def get_entry_exit_logs():

    try:

        response = (
            supabase
            .table("entry_exit_logs")
            .select("*")
            .order(
                "timestamp",
                desc=True
            )
            .execute()
        )

        return {
            "count": len(response.data),
            "logs": response.data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to retrieve "
                f"entry/exit logs: {str(e)}"
            )
        )


# =====================================================
# INCIDENT REPORTING
# =====================================================

@app.post("/incidents")
def create_incident(incident: dict):

    try:

        # -------------------------------------------------
        # Required fields
        # -------------------------------------------------

        if not incident.get("incident_code"):

            raise HTTPException(
                status_code=400,
                detail="incident_code is required"
            )

        if not incident.get("title"):

            raise HTTPException(
                status_code=400,
                detail="title is required"
            )

        if not incident.get("description"):

            raise HTTPException(
                status_code=400,
                detail="description is required"
            )

        # -------------------------------------------------
        # Validate severity
        # -------------------------------------------------

        severity = incident.get(
            "severity",
            "medium"
        )

        if severity not in [
            "low",
            "medium",
            "high",
            "critical"
        ]:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Severity must be "
                    "low, medium, high, or critical"
                )
            )

        # -------------------------------------------------
        # Validate status
        # -------------------------------------------------

        status = incident.get(
            "status",
            "open"
        )

        if status not in [
            "open",
            "investigating",
            "resolved",
            "closed"
        ]:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Status must be open, "
                    "investigating, resolved, or closed"
                )
            )

        # -------------------------------------------------
        # Prepare database record
        # -------------------------------------------------

        record = {
            "incident_code": incident["incident_code"],
            "title": incident["title"],
            "description": incident["description"],
            "location": incident.get("location"),
            "severity": severity,
            "status": status,
            "resolution_notes": incident.get(
                "resolution_notes"
            )
        }

        # -------------------------------------------------
        # Insert incident
        # -------------------------------------------------

        response = (
            supabase
            .table("incidents")
            .insert(record)
            .execute()
        )

        return {
            "message": "Incident reported successfully",
            "incident": response.data
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to create incident: "
                f"{str(e)}"
            )
        )


# =====================================================
# GET INCIDENTS
# =====================================================

@app.get("/incidents")
def get_incidents():

    try:

        response = (
            supabase
            .table("incidents")
            .select("*")
            .order(
                "incident_time",
                desc=True
            )
            .execute()
        )

        return {
            "count": len(response.data),
            "incidents": response.data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to retrieve incidents: "
                f"{str(e)}"
            )
        )


# =====================================================
# GET SINGLE INCIDENT
# =====================================================

@app.get("/incidents/{incident_code}")
def get_incident(incident_code: str):

    try:

        response = (
            supabase
            .table("incidents")
            .select("*")
            .eq(
                "incident_code",
                incident_code
            )
            .execute()
        )

        if not response.data:

            raise HTTPException(
                status_code=404,
                detail="Incident not found"
            )

        return {
            "incident": response.data[0]
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to retrieve incident: "
                f"{str(e)}"
            )
        )


# =====================================================
# GENAI INCIDENT ANALYSIS
# =====================================================

@app.post(
    "/incidents/{incident_code}/ai-analysis"
)
def incident_ai_analysis(
    incident_code: str
):

    try:

        # -------------------------------------------------
        # Get incident
        # -------------------------------------------------

        response = (
            supabase
            .table("incidents")
            .select("*")
            .eq(
                "incident_code",
                incident_code
            )
            .execute()
        )

        if not response.data:

            raise HTTPException(
                status_code=404,
                detail="Incident not found"
            )

        incident = response.data[0]

        # -------------------------------------------------
        # Send incident to Gemini
        # -------------------------------------------------

        ai_result = analyze_incident(
            incident
        )

        # -------------------------------------------------
        # Determine risk level
        # -------------------------------------------------

        ai_upper = ai_result.upper()

        if "CRITICAL" in ai_upper:

            risk_level = "critical"

        elif "HIGH" in ai_upper:

            risk_level = "high"

        elif "MEDIUM" in ai_upper:

            risk_level = "medium"

        else:

            risk_level = "low"

        # -------------------------------------------------
        # Save AI analysis
        # -------------------------------------------------

        ai_record = {
            "incident_id": incident["id"],

            "analysis_type": "risk_assessment",

            "input_text": (
                f"Incident Code: {incident_code}\n"
                f"Title: {incident['title']}\n"
                f"Description: "
                f"{incident['description']}\n"
                f"Location: "
                f"{incident.get('location')}\n"
                f"Severity: "
                f"{incident['severity']}"
            ),

            "ai_output": ai_result,

            "ai_risk_level": risk_level,

            "model_name": "gemini-3.5-flash-lite"
        }

        (
            supabase
            .table("ai_analyses")
            .insert(ai_record)
            .execute()
        )

        # -------------------------------------------------
        # Return AI result
        # -------------------------------------------------

        return {
            "incident_code": incident_code,
            "risk_level": risk_level,
            "ai_analysis": ai_result,
            "saved_to_database": True
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "AI incident analysis failed: "
                f"{str(e)}"
            )
        )