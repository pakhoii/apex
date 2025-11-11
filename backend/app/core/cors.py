from fastapi.middleware.cors import CORSMiddleware

# Allows connect between frontend and backend during development
def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )