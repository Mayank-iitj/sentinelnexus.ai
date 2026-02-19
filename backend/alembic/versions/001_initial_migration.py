"""Initial migration - create all tables."""
from alembic import op
import sqlalchemy as sa

revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True, index=True),
        sa.Column('username', sa.String(100), nullable=False, unique=True),
        sa.Column('full_name', sa.String(255)),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('is_verified', sa.Boolean, default=False),
        sa.Column('role', sa.String(20), default='viewer'),
        sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
        sa.Column('last_login', sa.DateTime(timezone=True)),
    )

    # Organizations table
    op.create_table(
        'organizations',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('slug', sa.String(100), nullable=False, unique=True, index=True),
        sa.Column('description', sa.Text),
        sa.Column('logo_url', sa.String(500)),
        sa.Column('industry', sa.String(100)),
        sa.Column('country', sa.String(100)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )

    # Projects table
    op.create_table(
        'projects',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
        sa.Column('created_by', sa.String(36), sa.ForeignKey('users.id')),
        sa.Column('repo_url', sa.String(500)),
        sa.Column('repo_type', sa.String(20)),
        sa.Column('github_token', sa.String(500)),
        sa.Column('is_public', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )

    # Scans table
    op.create_table(
        'scans',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('project_id', sa.String(36), sa.ForeignKey('projects.id'), nullable=False),
        sa.Column('scan_type', sa.String(50), nullable=False),
        sa.Column('status', sa.String(20), default='pending'),
        sa.Column('ai_risk_score', sa.Float, default=0.0),
        sa.Column('risk_level', sa.String(20)),
        sa.Column('findings_summary', sa.JSON, default={}),
        sa.Column('file_count', sa.Integer, default=0),
        sa.Column('execution_time_seconds', sa.Integer),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
        sa.Column('completed_at', sa.DateTime(timezone=True)),
        sa.Column('error_message', sa.Text),
        sa.Column('is_archived', sa.Boolean, default=False),
    )

    # ScanResults table
    op.create_table(
        'scan_results',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('scan_id', sa.String(36), sa.ForeignKey('scans.id'), nullable=False),
        sa.Column('finding_type', sa.String(100), nullable=False),
        sa.Column('severity', sa.String(20)),
        sa.Column('file_path', sa.String(500)),
        sa.Column('line_number', sa.Integer),
        sa.Column('description', sa.Text),
        sa.Column('code_snippet', sa.Text),
        sa.Column('remediation', sa.Text),
        sa.Column('is_reviewed', sa.Boolean, default=False),
        sa.Column('is_resolved', sa.Boolean, default=False),
        sa.Column('metadata', sa.JSON, default={}),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Alerts table
    op.create_table(
        'alerts',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('project_id', sa.String(36), sa.ForeignKey('projects.id'), nullable=False),
        sa.Column('alert_type', sa.String(50), nullable=False),
        sa.Column('severity', sa.String(20)),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('is_read', sa.Boolean, default=False),
        sa.Column('is_resolved', sa.Boolean, default=False),
        sa.Column('metadata', sa.JSON, default={}),
        sa.Column('triggered_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # AuditLogs table
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('resource_type', sa.String(50)),
        sa.Column('resource_id', sa.String(36)),
        sa.Column('description', sa.Text),
        sa.Column('ip_address', sa.String(50)),
        sa.Column('user_agent', sa.String(500)),
        sa.Column('changes', sa.JSON, default={}),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Subscriptions table
    op.create_table(
        'subscriptions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
        sa.Column('plan', sa.String(50), default='free'),
        sa.Column('status', sa.String(20), default='active'),
        sa.Column('stripe_customer_id', sa.String(255), unique=True),
        sa.Column('stripe_subscription_id', sa.String(255)),
        sa.Column('scans_per_month', sa.Integer),
        sa.Column('api_calls_per_day', sa.Integer),
        sa.Column('includes_custom_rules', sa.Boolean, default=False),
        sa.Column('includes_slack', sa.Boolean, default=False),
        sa.Column('includes_soc2', sa.Boolean, default=False),
        sa.Column('monthly_price', sa.Integer, default=0),
        sa.Column('billing_cycle_start', sa.DateTime(timezone=True)),
        sa.Column('billing_cycle_end', sa.DateTime(timezone=True)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )

    # Create indexes
    op.create_index('ix_user_email', 'users', ['email'])
    op.create_index('ix_user_organization_id', 'users', ['organization_id'])
    op.create_index('ix_org_slug', 'organizations', ['slug'])
    op.create_index('ix_project_org_id', 'projects', ['organization_id'])
    op.create_index('ix_project_created_by', 'projects', ['created_by'])
    op.create_index('ix_scan_project_id', 'scans', ['project_id'])
    op.create_index('ix_scan_status', 'scans', ['status'])
    op.create_index('ix_scan_created_at', 'scans', ['created_at'])
    op.create_index('ix_result_scan_id', 'scan_results', ['scan_id'])
    op.create_index('ix_result_severity', 'scan_results', ['severity'])
    op.create_index('ix_alert_project_id', 'alerts', ['project_id'])
    op.create_index('ix_alert_severity', 'alerts', ['severity'])
    op.create_index('ix_audit_user_id', 'audit_logs', ['user_id'])
    op.create_index('ix_audit_org_id', 'audit_logs', ['organization_id'])
    op.create_index('ix_audit_created_at', 'audit_logs', ['created_at'])
    op.create_index('ix_sub_org_id', 'subscriptions', ['organization_id'])
    op.create_index('ix_sub_plan', 'subscriptions', ['plan'])


def downgrade() -> None:
    # Drop all tables
    op.drop_index('ix_sub_plan')
    op.drop_index('ix_sub_org_id')
    op.drop_index('ix_audit_created_at')
    op.drop_index('ix_audit_org_id')
    op.drop_index('ix_audit_user_id')
    op.drop_index('ix_alert_severity')
    op.drop_index('ix_alert_project_id')
    op.drop_index('ix_result_severity')
    op.drop_index('ix_result_scan_id')
    op.drop_index('ix_scan_created_at')
    op.drop_index('ix_scan_status')
    op.drop_index('ix_scan_project_id')
    op.drop_index('ix_project_created_by')
    op.drop_index('ix_project_org_id')
    op.drop_index('ix_org_slug')
    op.drop_index('ix_user_organization_id')
    op.drop_index('ix_user_email')
    
    op.drop_table('subscriptions')
    op.drop_table('audit_logs')
    op.drop_table('alerts')
    op.drop_table('scan_results')
    op.drop_table('scans')
    op.drop_table('projects')
    op.drop_table('organizations')
    op.drop_table('users')
