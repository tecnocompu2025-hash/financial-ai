from datetime import date
from calendar import monthrange
from fastapi import HTTPException
from app.repositories.mortgage_repository import MortgageRepository

class MortgageService:
    def __init__(self, db): self.repository = MortgageRepository(db)
    def _summary(self, item):
        monthly_rate = item.annual_interest_rate / 100 / 12
        months = max(1, item.remaining_months)
        if monthly_rate == 0:
            payment = item.current_balance / months
        else:
            factor = (1 + monthly_rate) ** months
            payment = item.current_balance * monthly_rate * factor / (factor - 1)
        next_interest = item.current_balance * monthly_rate
        return {"id": item.id, "user_id": item.user_id, "name": item.name, "principal": item.principal, "current_balance": item.current_balance, "credit_type": item.credit_type, "credit_limit": item.credit_limit, "annual_interest_rate": item.annual_interest_rate, "term_months": item.term_months, "remaining_months": item.remaining_months, "start_date": item.start_date, "next_due_date": item.next_due_date, "monthly_payment": round(payment, 2), "total_interest": round(payment * months - item.current_balance, 2), "next_interest": round(next_interest, 2), "next_principal": round(max(0, payment - next_interest), 2)}
    def create(self, user_id, data): return self._summary(self.repository.create(user_id, data))
    def get_all(self, user_id): return [self._summary(item) for item in self.repository.get_all(user_id)]
    def update(self, item_id, user_id, data):
        item = self.repository.get_by_id(item_id, user_id)
        if not item: raise HTTPException(status_code=404, detail="Crédito no encontrado")
        return self._summary(self.repository.update(item, data))
    def delete(self, item_id, user_id):
        item = self.repository.get_by_id(item_id, user_id)
        if not item: raise HTTPException(status_code=404, detail="Crédito hipotecario no encontrado")
        self.repository.delete(item); return {"message": "Crédito hipotecario eliminado correctamente"}
    def pay(self, item_id, user_id, data):
        item = self.repository.get_by_id(item_id, user_id)
        if not item: raise HTTPException(status_code=404, detail="Crédito no encontrado")
        if item.current_balance <= 0:
            raise HTTPException(status_code=400, detail="El crédito ya está pagado")
        expected_payment = self._summary(item)["monthly_payment"]
        interest = item.current_balance * (item.annual_interest_rate / 100 / 12)
        principal_paid = min(item.current_balance, max(0, data.amount - interest))
        item.current_balance = round(item.current_balance - principal_paid, 2)
        completed_installment = data.amount + 0.005 >= expected_payment or item.current_balance <= 0
        if completed_installment:
            item.remaining_months = max(0, item.remaining_months - 1)
        if completed_installment and item.remaining_months > 0:
            month = item.next_due_date.month % 12 + 1
            year = item.next_due_date.year + (item.next_due_date.month // 12)
            item.next_due_date = date(year, month, min(item.next_due_date.day, monthrange(year, month)[1]))
        payment = self.repository.add_payment(item, data.amount, round(interest, 2), round(principal_paid, 2), data.paid_date)
        return {"id": payment.id, "amount": payment.amount, "paid_date": payment.paid_date, "interest_amount": payment.interest_amount, "principal_amount": payment.principal_amount}
    def payments(self, item_id, user_id):
        item = self.repository.get_by_id(item_id, user_id)
        if not item: raise HTTPException(status_code=404, detail="Crédito no encontrado")
        return self.repository.payments(item)
    def amortization(self, item_id, user_id):
        item = self.repository.get_by_id(item_id, user_id)
        if not item: raise HTTPException(status_code=404, detail="Crédito no encontrado")
        balance = item.current_balance
        rate = item.annual_interest_rate / 100 / 12
        months = item.remaining_months
        if months <= 0 or balance <= 0: return []
        payment = balance / months if rate == 0 else balance * rate * (1 + rate) ** months / ((1 + rate) ** months - 1)
        rows = []
        for installment in range(1, months + 1):
            interest = balance * rate
            principal = min(balance, payment - interest)
            balance = max(0, balance - principal)
            rows.append({"installment": installment, "payment": round(payment, 2), "interest": round(interest, 2), "principal": round(principal, 2), "remaining_balance": round(balance, 2)})
            if balance == 0: break
        return rows
