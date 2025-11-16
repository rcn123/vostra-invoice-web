"""rename failed to extraction_failed

Revision ID: c8f3a1b9e2d4
Revises: b79230a2ecd7
Create Date: 2025-11-16 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c8f3a1b9e2d4'
down_revision = 'b79230a2ecd7'
branch_labels = None
depends_on = None


def upgrade():
    """Update existing 'failed' status to 'extraction_failed'"""
    # Update all invoices with status='failed' to status='extraction_failed'
    op.execute(
        "UPDATE invoices SET status = 'extraction_failed' WHERE status = 'failed'"
    )


def downgrade():
    """Revert 'extraction_failed' status back to 'failed'"""
    # Revert all invoices with status='extraction_failed' back to status='failed'
    op.execute(
        "UPDATE invoices SET status = 'failed' WHERE status = 'extraction_failed'"
    )
