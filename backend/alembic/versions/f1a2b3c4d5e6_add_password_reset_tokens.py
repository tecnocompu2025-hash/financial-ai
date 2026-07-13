"""add password reset tokens

Revision ID: f1a2b3c4d5e6
Revises: e0f1a2b3c4d5
"""
from alembic import op
import sqlalchemy as sa
revision = "f1a2b3c4d5e6"
down_revision = "e0f1a2b3c4d5"
branch_labels = None
depends_on = None
def upgrade():
    op.create_table("password_reset_tokens", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False), sa.Column("token_hash", sa.String(length=64), nullable=False, unique=True), sa.Column("expires_at", sa.DateTime(), nullable=False), sa.Column("used", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.create_index("ix_password_reset_tokens_user_id", "password_reset_tokens", ["user_id"])
def downgrade():
    op.drop_index("ix_password_reset_tokens_user_id", table_name="password_reset_tokens"); op.drop_table("password_reset_tokens")
