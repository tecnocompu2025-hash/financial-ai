"""create profiles table

Revision ID: f91aea729655
Revises: a4cd1b6b50d4
Create Date: 2026-07-09 14:32:45.711454

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f91aea729655"
down_revision: Union[str, Sequence[str], None] = "a4cd1b6b50d4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "profiles",

        sa.Column("id", sa.Integer(), primary_key=True),

        sa.Column(
            "user_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "country",
            sa.String(length=100),
            nullable=False,
        ),

        sa.Column(
            "currency",
            sa.String(length=10),
            nullable=False,
        ),

        sa.Column(
            "age",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "marital_status",
            sa.String(length=50),
            nullable=False,
        ),

        sa.Column(
            "children",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "retirement_age",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "financial_goal",
            sa.String(length=255),
            nullable=False,
        ),

        sa.Column(
            "monthly_salary",
            sa.Float(),
            nullable=False,
        ),

        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),

        sa.UniqueConstraint("user_id"),
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_table("profiles")