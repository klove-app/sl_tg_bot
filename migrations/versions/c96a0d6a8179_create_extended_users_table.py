"""create extended_users table

Revision ID: c96a0d6a8179
Revises: c80332eab442
Create Date: 2025-01-15 20:34:02.091523

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c96a0d6a8179'
down_revision: Union[str, None] = 'c80332eab442'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('extended_users',
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('username', sa.String(), nullable=True),
        sa.Column('password_hash', sa.String(), nullable=True),
        sa.Column('auth_type', sa.String(), nullable=True),
        sa.Column('auth_code', sa.String(), nullable=True),
        sa.Column('auth_code_expires', sa.DateTime(), nullable=True),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.Column('last_password_change', sa.DateTime(), nullable=True),
        sa.Column('failed_login_attempts', sa.Integer(), nullable=True),
        sa.Column('is_locked', sa.Boolean(), nullable=True),
        sa.Column('notification_preferences', sa.JSON(), nullable=True),
        sa.Column('privacy_settings', sa.JSON(), nullable=True),
        sa.Column('timezone', sa.String(), nullable=True),
        sa.Column('language', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
        sa.PrimaryKeyConstraint('user_id')
    )
    op.create_index(op.f('ix_extended_users_email'), 'extended_users', ['email'], unique=True)
    op.create_index(op.f('ix_extended_users_user_id'), 'extended_users', ['user_id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_extended_users_user_id'), table_name='extended_users')
    op.drop_index(op.f('ix_extended_users_email'), table_name='extended_users')
    op.drop_table('extended_users')
    # ### end Alembic commands ###
