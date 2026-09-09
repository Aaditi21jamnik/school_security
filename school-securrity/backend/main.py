from fastapi import FastAPI

app = FastAPI(
    title="School Security Administration System",
    description="GenAI-powered school security backend",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "School Security Backend is running"
    }

@app.get("/health")
def health():
    return {
        "status": "OK"
    }