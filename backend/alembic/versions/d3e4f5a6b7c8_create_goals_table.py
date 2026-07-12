from alembic import op
import sqlalchemy as sa
revision = "d3e4f5a6b7c8"
down_revision = "c2d3e4f5a6b7"
branch_labels = None
depends_on = None
def upgrade():
    op.create_table("goals", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), nullable=False), sa.Column("name", sa.String(100), nullable=False), sa.Column("target_amount", sa.Float(), nullable=False), sa.Column("current_amount", sa.Float(), nullable=False), sa.ForeignKeyConstraint(["user_id"], ["users.id"]))
def downgrade(): op.drop_table("goals")
