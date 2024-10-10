"""Add cascade delete for category and accommodation

Revision ID: 0231e581bee1
Revises: 669c45763d62
Create Date: 2024-10-09 22:10:48.445598

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0231e581bee1'
down_revision = '669c45763d62'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('accommodations', schema=None) as batch_op:
        batch_op.drop_constraint('fk_accommodations_category_id_categories', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_accommodations_category_id_categories'), 'categories', ['category_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('accommodations', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_accommodations_category_id_categories'), type_='foreignkey')
        batch_op.create_foreign_key('fk_accommodations_category_id_categories', 'categories', ['category_id'], ['id'])

    # ### end Alembic commands ###
