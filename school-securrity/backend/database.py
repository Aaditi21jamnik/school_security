from pathlib import Path

from dotenv import dotenv_values
from supabase import Client, create_client


# Find backend/.env
ENV_FILE = Path(__file__).resolve().parent / ".env"

# Read .env
config = dotenv_values(ENV_FILE)

SUPABASE_URL = config.get("SUPABASE_URL")
SUPABASE_SECRET_KEY = config.get("SUPABASE_SECRET_KEY")


if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is missing in .env")

if not SUPABASE_SECRET_KEY:
    raise ValueError("SUPABASE_SECRET_KEY is missing in .env")


supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)