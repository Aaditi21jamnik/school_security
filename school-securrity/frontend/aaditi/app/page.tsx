"use client";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Visitor = {
  visitor_code: string;
  full_name: string;
  phone: string;
  id_type: string;
  id_number: string;
  purpose: string;
  person_to_meet: string;
  organization: string;
  verification_status: string;
};

type Incident = {
  incident_code: string;
  title: string;
  description: string;
  location: string;
  severity: string;
  status: string;
};

export default function Home() {
  const [visitor, setVisitor] = useState<Visitor>({
    visitor_code: "",
    full_name: "",
    phone: "",
    id_type: "",
    id_number: "",
    purpose: "",
    person_to_meet: "",
    organization: "",
    verification_status: "pending",
  });

  const [incident, setIncident] = useState<Incident>({
    incident_code: "",
    title: "",
    description: "",
    location: "",
    severity: "medium",
    status: "open",
  });

  const [visitorMessage, setVisitorMessage] = useState("");
  const [incidentMessage, setIncidentMessage] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [riskLevel, setRiskLevel] = useState("");

  const [visitorLoading, setVisitorLoading] = useState(false);
  const [incidentLoading, setIncidentLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // =====================================================
  // REGISTER VISITOR
  // =====================================================

  async function registerVisitor(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setVisitorLoading(true);
    setVisitorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/visitors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitor),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to register visitor"
        );
      }

      setVisitorMessage(
        "Visitor registered successfully."
      );

      setVisitor({
        visitor_code: "",
        full_name: "",
        phone: "",
        id_type: "",
        id_number: "",
        purpose: "",
        person_to_meet: "",
        organization: "",
        verification_status: "pending",
      });
    } catch (error) {
      setVisitorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setVisitorLoading(false);
    }
  }

  // =====================================================
  // REPORT INCIDENT
  // =====================================================

  async function reportIncident(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setIncidentLoading(true);
    setIncidentMessage("");

    try {
      const response = await fetch(
        `${API_URL}/incidents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(incident),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to report incident"
        );
      }

      setIncidentMessage(
        "Incident reported successfully."
      );
    } catch (error) {
      setIncidentMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIncidentLoading(false);
    }
  }

  // =====================================================
  // AI ANALYSIS
  // =====================================================

  async function analyzeIncident() {
    if (!incident.incident_code) {
      setAiResult(
        "Please enter an incident code first."
      );
      return;
    }

    setAiLoading(true);
    setAiResult("");
    setRiskLevel("");

    try {
      const response = await fetch(
        `${API_URL}/incidents/${incident.incident_code}/ai-analysis`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "AI analysis failed"
        );
      }

      setRiskLevel(data.risk_level);
      setAiResult(data.ai_analysis);
    } catch (error) {
      setAiResult(
        error instanceof Error
          ? error.message
          : "AI analysis failed"
      );
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            background: "#0f172a",
            color: "white",
            padding: "30px",
            borderRadius: "18px",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
            }}
          >
            🏫 School Security Administration
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#cbd5e1",
            }}
          >
            Visitor management, incident reporting and
            GenAI-powered security analysis.
          </p>
        </div>


        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "25px",
          }}
        >

          {/* =================================================
              VISITOR
          ================================================= */}

          <section
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2>👤 Register Visitor</h2>

            <p style={{ color: "#64748b" }}>
              Register a visitor entering the school.
            </p>

            <form
              onSubmit={registerVisitor}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >

              <input
                placeholder="Visitor Code"
                value={visitor.visitor_code}
                onChange={(e) =>
                  setVisitor({
                    ...visitor,
                    visitor_code: e.target.value,
                  })
                }
                required
                style={inputStyle}
              />

              <input
                placeholder="Full Name"
                value={visitor.full_name}
                onChange={(e) =>
                  setVisitor({
                    ...visitor,
                    full_name: e.target.value,
                  })
                }
                required
                style={inputStyle}
              />

              <input
                placeholder="Phone"
                value={visitor.phone}
                onChange={(e) =>
                  setVisitor({
                    ...visitor,
                    phone: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                placeholder="ID Type"
                value={visitor.id_type}
                onChange={(e) =>
                  setVisitor({
                    ...visitor,
                    id_type: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                placeholder="ID Number"
                value={visitor.id_number}
                onChange={(e) =>
                  setVisitor({
                    ...visitor,
                    id_number: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                placeholder="Purpose"
                value={visitor.purpose}
                onChange={(e) =>
                  setVisitor({
                    ...visitor,
                    purpose: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                placeholder="Person to Meet"
                value={visitor.person_to_meet}
                onChange={(e) =>
                  setVisitor({
                    ...visitor,
                    person_to_meet: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                placeholder="Organization"
                value={visitor.organization}
                onChange={(e) =>
                  setVisitor({
                    ...visitor,
                    organization: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <select
                value={visitor.verification_status}
                onChange={(e) =>
                  setVisitor({
                    ...visitor,
                    verification_status: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="pending">
                  Pending
                </option>

                <option value="verified">
                  Verified
                </option>

                <option value="rejected">
                  Rejected
                </option>
              </select>

              <button
                type="submit"
                disabled={visitorLoading}
                style={{
                  ...buttonStyle,
                  background: "#2563eb",
                }}
              >
                {visitorLoading
                  ? "Registering..."
                  : "Register Visitor"}
              </button>

            </form>

            {visitorMessage && (
              <p
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                }}
              >
                {visitorMessage}
              </p>
            )}
          </section>


          {/* =================================================
              INCIDENT
          ================================================= */}

          <section
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2>🚨 Security Incident</h2>

            <p style={{ color: "#64748b" }}>
              Report an incident and analyze it using GenAI.
            </p>

            <form
              onSubmit={reportIncident}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >

              <input
                placeholder="Incident Code"
                value={incident.incident_code}
                onChange={(e) =>
                  setIncident({
                    ...incident,
                    incident_code: e.target.value,
                  })
                }
                required
                style={inputStyle}
              />

              <input
                placeholder="Incident Title"
                value={incident.title}
                onChange={(e) =>
                  setIncident({
                    ...incident,
                    title: e.target.value,
                  })
                }
                required
                style={inputStyle}
              />

              <textarea
                placeholder="Describe the incident..."
                rows={6}
                value={incident.description}
                onChange={(e) =>
                  setIncident({
                    ...incident,
                    description: e.target.value,
                  })
                }
                required
                style={inputStyle}
              />

              <input
                placeholder="Location"
                value={incident.location}
                onChange={(e) =>
                  setIncident({
                    ...incident,
                    location: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <select
                value={incident.severity}
                onChange={(e) =>
                  setIncident({
                    ...incident,
                    severity: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="low">Low</option>
                <option value="medium">
                  Medium
                </option>
                <option value="high">High</option>
                <option value="critical">
                  Critical
                </option>
              </select>

              <button
                type="submit"
                disabled={incidentLoading}
                style={{
                  ...buttonStyle,
                  background: "#dc2626",
                }}
              >
                {incidentLoading
                  ? "Reporting..."
                  : "Report Incident"}
              </button>

            </form>

            {incidentMessage && (
              <p
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                }}
              >
                {incidentMessage}
              </p>
            )}


            {/* =================================================
                AI
            ================================================= */}

            <div
              style={{
                marginTop: "30px",
                paddingTop: "25px",
                borderTop:
                  "1px solid #e2e8f0",
              }}
            >

              <h3>
                🤖 GenAI Security Analysis
              </h3>

              <p style={{ color: "#64748b" }}>
                Analyze the reported incident using AI.
              </p>

              <button
                onClick={analyzeIncident}
                disabled={aiLoading}
                style={{
                  ...buttonStyle,
                  background: "#7c3aed",
                }}
              >
                {aiLoading
                  ? "AI is analyzing..."
                  : "Analyze with GenAI"}
              </button>


              {riskLevel && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                  }}
                >
                  <strong>
                    Risk Level
                  </strong>

                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                      marginTop: "5px",
                      textTransform:
                        "uppercase",
                    }}
                  >
                    {riskLevel}
                  </div>
                </div>
              )}


              {aiResult && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "20px",
                    background: "#0f172a",
                    color: "white",
                    borderRadius: "12px",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.6",
                  }}
                >
                  {aiResult}
                </div>
              )}

            </div>

          </section>

        </div>

      </div>
    </main>
  );
}


// =====================================================
// STYLES
// =====================================================

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer",
};