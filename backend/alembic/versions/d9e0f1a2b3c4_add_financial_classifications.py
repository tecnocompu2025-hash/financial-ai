"""add financial classifications

Revision ID: d9e0f1a2b3c4
Revises: c8d9e0f1a2b3
"""
from alembic import op
import sqlalchemy as sa

revision = "d9e0f1a2b3c4"
down_revision = "c8d9e0f1a2b3"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("assets", sa.Column("classification", sa.String(length=20), nullable=False, server_default="non_productive"))
    op.add_column("liabilities", sa.Column("classification", sa.String(length=10), nullable=False, server_default="bad"))
    op.add_column("liabilities", sa.Column("annual_interest_rate", sa.Float(), nullable=False, server_default="0"))


def downgrade():
    op.drop_column("liabilities", "annual_interest_rate")
    op.drop_column("liabilities", "classification")
    op.drop_column("assets", "classification")
