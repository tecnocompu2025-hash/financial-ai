from sqlalchemy.orm import Session
from app.models.mortgage import Mortgage
from app.models.credit_payment import CreditPayment

class MortgageRepository:
    def __init__(self, db: Session): self.db = db
    def create(self, user_id, data):
        item = Mortgage(user_id=user_id, current_balance=data.principal, remaining_months=data.term_months, next_due_date=data.start_date, **data.model_dump()); self.db.add(item); self.db.commit(); self.db.refresh(item); return item
    def get_all(self, user_id): return self.db.query(Mortgage).filter(Mortgage.user_id == user_id).order_by(Mortgage.id.desc()).all()
    def get_by_id(self, item_id, user_id): return self.db.query(Mortgage).filter(Mortgage.id == item_id, Mortgage.user_id == user_id).first()
    def delete(self, item): self.db.delete(item); self.db.commit()
    def update(self, item, data):
        for key, value in data.model_dump().items(): setattr(item, key, value)
        item.current_balance = min(item.current_balance, item.principal)
        self.db.commit(); self.db.refresh(item); return item
    def add_payment(self, item, amount, interest_amount, principal_amount, paid_date):
        payment = CreditPayment(mortgage_id=item.id, amount=amount, interest_amount=interest_amount, principal_amount=principal_amount, paid_date=paid_date)
        self.db.add(payment); self.db.commit(); self.db.refresh(payment); return payment
    def payments(self, item): return self.db.query(CreditPayment).filter(CreditPayment.mortgage_id == item.id).order_by(CreditPayment.paid_date.desc(), CreditPayment.id.desc()).all()
