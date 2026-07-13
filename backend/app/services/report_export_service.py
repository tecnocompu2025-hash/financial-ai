from io import BytesIO

from openpyxl import Workbook
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


class ReportExportService:
    @staticmethod
    def excel(report):
        workbook = Workbook(); summary = workbook.active; summary.title = "Resumen"
        summary.append(["Indicador", "Monto"])
        for key, value in report.summary.model_dump().items(): summary.append([key, value])
        transactions = workbook.create_sheet("Movimientos"); transactions.append(["Fecha", "Tipo", "Categoría", "Detalle", "Monto"])
        for item in report.transactions: transactions.append([item.date.isoformat(), item.record_type, item.category, item.name, item.amount])
        stream = BytesIO(); workbook.save(stream); stream.seek(0); return stream

    @staticmethod
    def pdf(report):
        stream = BytesIO(); document = canvas.Canvas(stream, pagesize=letter); y = 750
        document.setTitle("Reporte Financial AI"); document.setFont("Helvetica-Bold", 16); document.drawString(50, y, "Reporte financiero"); y -= 35
        document.setFont("Helvetica", 10)
        for key, value in report.summary.model_dump().items(): document.drawString(50, y, f"{key}: {value:.2f}"); y -= 16
        document.save(); stream.seek(0); return stream
