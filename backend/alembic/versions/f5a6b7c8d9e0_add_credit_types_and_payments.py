"""add credit types and payments

Revision ID: f5a6b7c8d9e0
Revises: e4f5a6b7c8d9
"""
from alembic import op
import sqlalchemy as sa

revision = "f5a6b7c8d9e0"
down_revision = "e4f5a6b7c8d9"
branch_labels = None
depends_on = None

def upgrade():
    op.add_column("mortgages", sa.Column("current_balance", sa.Float(), nullable=True))
    op.add_column("mortgages", sa.Column("credit_type", sa.String(length=30), nullable=True))
    op.add_column("mortgages", sa.Column("credit_limit", sa.Float(), nullable=True))
    op.execute("UPDATE mortgages SET current_balance = principal, credit_type = 'Hipotecario'")
    op.alter_column("mortgages", "current_balance", nullable=False)
    op.alter_column("mortgages", "credit_type", nullable=False)
    op.create_table("credit_payments", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("mortgage_id", sa.Integer(), sa.ForeignKey("mortgages.id"), nullable=False), sa.Column("amount", sa.Float(), nullable=False), sa.Column("interest_amount", sa.Float(), nullable=False), sa.Column("principal_amount", sa.Float(), nullable=False), sa.Column("paid_date", sa.Date(), nullable=False))

def downgrade():
    op.drop_table("credit_payments")
    op.drop_column("mortgages", "credit_type")
    op.drop_column("mortgages", "credit_limit")
    op.drop_column("mortgages", "current_balance")
