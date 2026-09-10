import os
from pathlib import Path

from dotenv import dotenv_values
from supabase import Client, create_client


ENV_FILE = Path(__file__).resolve().parent / ".env"

config = dotenv_values(ENV_FILE)

SUPABASE_URL = (
    os.getenv("SUPABASE_URL")
    or config.get("SUPABASE_URL")
)

SUPABASE_SECRET_KEY = (
    os.getenv("SUPABASE_SECRET_KEY")
    or config.get("SUPABASE_SECRET_KEY")
)


if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is missing")

if not SUPABASE_SECRET_KEY:
    raise ValueError("SUPABASE_SECRET_KEY is missing")


supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)