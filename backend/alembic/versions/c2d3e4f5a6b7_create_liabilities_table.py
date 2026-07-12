from alembic import op
import sqlalchemy as sa
revision = "c2d3e4f5a6b7"
down_revision = "b1c2d3e4f5a6"
branch_labels = None
depends_on = None
def upgrade():
    op.create_table("liabilities", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), nullable=False), sa.Column("name", sa.String(100), nullable=False), sa.Column("category", sa.String(50), nullable=False), sa.Column("balance", sa.Float(), nullable=False), sa.ForeignKeyConstraint(["user_id"], ["users.id"]))
def downgrade():
    op.drop_table("liabilities")
