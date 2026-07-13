"""add next due date

Revision ID: b7c8d9e0f1a2
Revises: a6b7c8d9e0f1
"""
from alembic import op
import sqlalchemy as sa
revision = "b7c8d9e0f1a2"
down_revision = "a6b7c8d9e0f1"
branch_labels = None
depends_on = None
def upgrade():
    op.add_column("mortgages", sa.Column("next_due_date", sa.Date(), nullable=True))
    op.execute("UPDATE mortgages SET next_due_date = start_date")
    op.alter_column("mortgages", "next_due_date", nullable=False)
def downgrade(): op.drop_column("mortgages", "next_due_date")
