"""Verifica el CRUD de gastos contra una API local ya iniciada.

Ejecutar desde backend con:
    ..\\.venv\\Scripts\\python.exe scripts\\verify_expense_crud.py
"""

import json
import sys
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database.session import SessionLocal
from app.models.user import User
from app.security.security import create_access_token

BASE_URL = "http://127.0.0.1:8000"


def request(method: str, path: str, token: str, payload: dict | None = None):
    body = json.dumps(payload).encode() if payload is not None else None
    headers = {"Authorization": f"Bearer {token}"}
    if body is not None:
        headers["Content-Type"] = "application/json"

    call = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=body,
        headers=headers,
        method=method,
    )
    with urllib.request.urlopen(call, timeout=10) as response:
        content = response.read().decode()
        return response.status, json.loads(content) if content else None


def main() -> None:
    with SessionLocal() as db:
        user = db.query(User).first()
        if user is None:
            raise RuntimeError("Crea un usuario antes de verificar el CRUD de gastos.")
        token = create_access_token({"sub": str(user.id)})

    expense_id = None
    payload = {
        "category": "Verificación",
        "amount": 1.0,
        "date": date.today().isoformat(),
        "description": "Registro temporal de prueba automática",
    }

    try:
        status, expense = request("POST", "/expense/", token, payload)
        assert status == 201
        expense_id = expense["id"]

        status, found = request("GET", f"/expense/{expense_id}", token)
        assert status == 200 and found["id"] == expense_id

        payload["amount"] = 2.0
        status, updated = request("PUT", f"/expense/{expense_id}", token, payload)
        assert status == 200 and updated["amount"] == 2.0

        status, expenses = request("GET", "/expense/", token)
        assert status == 200 and any(item["id"] == expense_id for item in expenses)

        status, _ = request("DELETE", f"/expense/{expense_id}", token)
        assert status == 200
        expense_id = None
        print("CRUD de gastos verificado correctamente.")
    finally:
        if expense_id is not None:
            try:
                request("DELETE", f"/expense/{expense_id}", token)
            except urllib.error.URLError:
                pass


if __name__ == "__main__":
    try:
        main()
    except (AssertionError, RuntimeError, urllib.error.URLError, urllib.error.HTTPError) as exc:
        print(f"La verificación falló: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
