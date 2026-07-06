from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "Financial AI API",
        "company": "TECNO COMPU E.I.R.L.",
        "version": "1.0.0"
    }