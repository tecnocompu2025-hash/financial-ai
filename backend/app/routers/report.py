from datetime import date

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.report import FinancialReport, ReportFilters
from app.services.report_service import ReportService
from app.services.report_export_service import ReportExportService

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/financial", response_model=FinancialReport)
def financial_report(
    month: int | None = Query(default=None, ge=1, le=12),
    year: int | None = Query(default=None, ge=2000, le=2100),
    category: str | None = Query(default=None, min_length=1, max_length=100),
    record_type: str = Query(default="all", pattern="^(all|income|expense)$"),
    date_from: date | None = None,
    date_to: date | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    filters = ReportFilters(month=month, year=year, category=category, record_type=record_type,
                            date_from=date_from, date_to=date_to)
    return ReportService(db).financial_report(current_user.id, filters)


@router.get("/export/{format}")
def export_report(format: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if format not in {"pdf", "xlsx"}:
        return {"detail": "Formato no soportado"}
    report = ReportService(db).financial_report(current_user.id, ReportFilters())
    stream = ReportExportService.pdf(report) if format == "pdf" else ReportExportService.excel(report)
    media_type = "application/pdf" if format == "pdf" else "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    return StreamingResponse(stream, media_type=media_type, headers={"Content-Disposition": f'attachment; filename="reporte-financial-ai.{format}"'})
