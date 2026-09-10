import os
from pathlib import Path

from dotenv import dotenv_values
from google import genai


# =====================================================
# LOAD GEMINI API KEY
# =====================================================

BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"

config = dotenv_values(ENV_FILE)

GEMINI_API_KEY = (
    os.getenv("GEMINI_API_KEY")
    or config.get("GEMINI_API_KEY")
)

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing")

# =====================================================
# CREATE GEMINI CLIENT
# =====================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# =====================================================
# INCIDENT ANALYSIS
# =====================================================

def analyze_incident(incident: dict) -> str:

    prompt = f"""
You are an AI security assistant for a school.

Analyze ONLY the incident information provided below.

INCIDENT INFORMATION:
{incident}

Return the result using exactly these sections:

1. SUMMARY
Give a short summary of what happened.

2. RISK LEVEL
Choose exactly one:
LOW
MEDIUM
HIGH
CRITICAL

3. THREAT / ISSUE
Explain the main security concern.

4. RECOMMENDATION
Give practical actions that the school security
administrator should consider.

5. ADMINISTRATIVE RESPONSE
Write a professional response suitable for a
school security administrator.

Rules:
- Do not invent facts.
- Use only the supplied incident information.
- Keep the response concise.
- Do not provide unsupported accusations.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return response.text