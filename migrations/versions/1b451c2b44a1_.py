"""empty message

Revision ID: 1b451c2b44a1
Revises: 
Create Date: 2023-04-03 22:13:53.384483

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1b451c2b44a1'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('firstname', sa.String(length=80), nullable=False),
    sa.Column('lastname', sa.String(length=80), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('contact', sa.String(length=80), nullable=False),
    sa.Column('admin', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('pet',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('genero', sa.String(length=120), nullable=True),
    sa.Column('tamaño', sa.String(length=120), nullable=False),
    sa.Column('color', sa.String(length=80), nullable=False),
    sa.Column('descripcion', sa.String(length=250), nullable=True),
    sa.Column('edad', sa.String(length=80), nullable=True),
    sa.Column('raza', sa.String(length=80), nullable=True),
    sa.Column('estado', sa.String(length=80), nullable=False),
    sa.Column('especie', sa.String(length=80), nullable=False),
    sa.Column('latitud', sa.String(length=100), nullable=True),
    sa.Column('longitud', sa.String(length=100), nullable=True),
    sa.Column('url', postgresql.ARRAY(sa.String()), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('pet')
    op.drop_table('user')
    # ### end Alembic commands ###
