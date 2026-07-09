from fastapi import FastAPI

from app.routers.health import router as health_router
from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router

app = FastAPI(
    title="Financial AI",
    version="1.0.0"
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(profile_router)


@app.get("/")
def home():
    return {
        "company": "TECNO COMPU E.I.R.L.",
        "project": "Financial AI",
        "version": "1.0.0",
        "status": "Running"
    }