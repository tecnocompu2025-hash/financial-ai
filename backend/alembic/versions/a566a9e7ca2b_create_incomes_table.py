"""create incomes table

Revision ID: a566a9e7ca2b
Revises: f91aea729655
Create Date: 2026-07-09 14:38:48.658804
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a566a9e7ca2b"
down_revision: Union[str, Sequence[str], None] = "f91aea729655"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "incomes",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
        ),

        sa.Column(
            "user_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "name",
            sa.String(100),
            nullable=False,
        ),

        sa.Column(
            "amount",
            sa.Float(),
            nullable=False,
        ),

        sa.Column(
            "category",
            sa.String(50),
            nullable=False,
        ),

        sa.Column(
            "frequency",
            sa.String(30),
            nullable=False,
        ),

        sa.Column(
            "is_passive",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),

        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
        ),

        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
    )


def downgrade() -> None:
    op.drop_table("incomes")