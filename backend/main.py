from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.health import router as health_router
from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router
from app.routers.income import router as income_router
from app.routers.expense import router as expense_router
from app.routers.asset import router as asset_router
from app.routers.liability import router as liability_router
from app.routers.goal import router as goal_router
from app.routers.dashboard import router as dashboard_router
from app.routers.mortgage import router as mortgage_router
from app.routers.report import router as report_router
from app.core.config import settings

app = FastAPI(
    title="Financial AI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(income_router)
app.include_router(expense_router)
app.include_router(asset_router)
app.include_router(liability_router)
app.include_router(goal_router)
app.include_router(dashboard_router)
app.include_router(mortgage_router)
app.include_router(report_router)


@app.get("/")
def home():
    return {
        "company": "TECNO COMPU E.I.R.L.",
        "project": "Financial AI",
        "version": "1.0.0",
        "status": "Running",
    }
