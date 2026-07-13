from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.exceptions import RequestValidationError
from fastapi.responses import StreamingResponse
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.report import FinancialReport, ReportFilters
from app.services.report_service import ReportService
from app.services.report_export_service import ReportExportService

router = APIRouter(prefix="/reports", tags=["Reports"])


def report_filters(
    month: int | None = Query(default=None, ge=1, le=12),
    year: int | None = Query(default=None, ge=2000, le=2100),
    category: str | None = Query(default=None, min_length=1, max_length=100),
    record_type: str = Query(default="all", pattern="^(all|income|expense)$"),
    date_from: date | None = None,
    date_to: date | None = None,
):
    try:
        return ReportFilters(
            month=month,
            year=year,
            category=category,
            record_type=record_type,
            date_from=date_from,
            date_to=date_to,
        )
    except ValidationError as error:
        raise RequestValidationError(error.errors()) from error


@router.get("/financial", response_model=FinancialReport)
def financial_report(
    filters: ReportFilters = Depends(report_filters),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ReportService(db).financial_report(current_user.id, filters)


@router.get("/export/{format}")
def export_report(
    format: str,
    filters: ReportFilters = Depends(report_filters),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if format not in {"pdf", "xlsx"}:
        raise HTTPException(status_code=404, detail="Formato no soportado")
    report = ReportService(db).financial_report(current_user.id, filters)
    stream = ReportExportService.pdf(report) if format == "pdf" else ReportExportService.excel(report)
    media_type = "application/pdf" if format == "pdf" else "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    return StreamingResponse(stream, media_type=media_type, headers={"Content-Disposition": f'attachment; filename="reporte-financial-ai.{format}"'})
