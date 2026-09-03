import sys
import os

# Add backend directory to sys.path so app and main can be imported relative to backend/
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from main import app
except Exception as err:
    import traceback
    print("❌ VERCEL SERVERLESS STARTUP ERROR:", err, file=sys.stderr)
    traceback.print_exc()
    raise err

# Export app for Vercel Serverless Function runtime
__all__ = ["app"]
