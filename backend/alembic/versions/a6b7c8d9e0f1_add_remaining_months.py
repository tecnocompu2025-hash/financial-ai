"""add remaining months

Revision ID: a6b7c8d9e0f1
Revises: f5a6b7c8d9e0
"""
from alembic import op
import sqlalchemy as sa
revision = "a6b7c8d9e0f1"
down_revision = "f5a6b7c8d9e0"
branch_labels = None
depends_on = None
def upgrade():
    op.add_column("mortgages", sa.Column("remaining_months", sa.Integer(), nullable=True))
    op.execute("UPDATE mortgages SET remaining_months = term_months")
    op.alter_column("mortgages", "remaining_months", nullable=False)
def downgrade(): op.drop_column("mortgages", "remaining_months")
