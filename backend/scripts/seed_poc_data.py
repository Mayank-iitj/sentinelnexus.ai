import uuid
from datetime import datetime, timedelta
from app.db.database import SessionLocal, engine, Base
from app.models.organization import Organization
from app.models.project import Project
from app.models.scan import Scan, ScanResult

def seed_poc():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Create Demo Org
        org = Organization(
            id=str(uuid.uuid4()),
            name="SentinelNexus Demo Corp",
            slug=f"sentinelnexus-demo-{uuid.uuid4().hex[:4]}",
            description="Security-focused demonstration organization for the SentinelNexus PoC."
        )
        db.add(org)
        
        # 2. Create Demo Project
        project = Project(
            id=str(uuid.uuid4()),
            organization_id=org.id,
            name="Cloud Commerce Infrastructure",
            description="Production environment for e-commerce API and frontend."
        )
        db.add(project)
        
        # 3. Create Demo Scan
        scan = Scan(
            id=str(uuid.uuid4()),
            project_id=project.id,
            scan_type="web",
            status="completed",
            ai_risk_score=8.7,
            risk_level="High",
            created_at=datetime.utcnow() - timedelta(minutes=45),
            completed_at=datetime.utcnow() - timedelta(minutes=5),
            findings_summary={"critical": 1, "high": 2, "medium": 1, "low": 0}
        )
        db.add(scan)
        db.flush() # Get IDs
        
        print("Scanning findings...")
        # 4. Inject High-Value Findings
        findings = [
            # Finding 1: SQL Injection
            ScanResult(
                id=str(uuid.uuid4()),
                scan_id=scan.id,
                finding_type="sql_injection",
                severity="Critical",
                description="Critical SQL Injection in /api/v1/orders. Unsanitized user input in the 'order_id' parameter allows for arbitrary database execution.",
                file_path="/api/v1/orders",
                remediation="Use parameterized queries or an ORM like SQLAlchemy to handle database interactions.",
                extra_data={
                    "title": "Critical SQL Injection in /api/v1/orders",
                    "cvss": 9.8,
                    "exploit_available": True,
                    "target": "order_id"
                }
            ),
            # Finding 2: Prompt Injection (AI Specific)
            ScanResult(
                id=str(uuid.uuid4()),
                scan_id=scan.id,
                finding_type="prompt_injection",
                severity="High",
                description="Direct Prompt Injection in Support Chatbot. Maliciously crafted prompts can bypass guardrails and leak system instructions.",
                file_path="SupportChatWidget",
                remediation="Implement robust input sanitization and use a dedicated security layer like SentinelNexus Guard.",
                extra_data={
                    "title": "Direct Prompt Injection in Support Chatbot",
                    "cvss": 8.1,
                    "risk": "System instruction leakage"
                }
            ),
            # Finding 3: PII Leakage
            ScanResult(
                id=str(uuid.uuid4()),
                scan_id=scan.id,
                finding_type="pii_exposure",
                severity="Medium",
                description="Sensitive Data Exposure (PII) in Logs. Customer email addresses found in plain text within API debug logs.",
                file_path="CloudWatch logs",
                remediation="Enable PII masking and ensure debug logs are sanitized before storage.",
                extra_data={
                    "title": "Sensitive Data Exposure (PII) in Logs",
                    "cvss": 5.5,
                    "pii_types": ["email"]
                }
            ),
            # Finding 4: BOLA
            ScanResult(
                id=str(uuid.uuid4()),
                scan_id=scan.id,
                finding_type="bola",
                severity="High",
                description="BOLA Vulnerability in User Profile API. Changing user_id in the URL allows access to other users' private profile data.",
                file_path="/api/users/{user_id}/private-info",
                remediation="Implement strict object-level authorization checks at the data layer.",
                extra_data={
                    "title": "BOLA Vulnerability in User Profile API",
                    "cvss": 7.5
                }
            )
        ]
        
        print(f"Adding {len(findings)} findings...")
        for f in findings:
            db.add(f)
            
        print("Committing to database...")
        db.commit()
        print(f"Successfully seeded PoC data for Org: {org.name}")
        print(f"Project ID: {project.id}")
        print(f"Scan ID: {scan.id}")
        
    except Exception as e:
        db.rollback()
        import traceback
        import sys
        with open("error_seeder.log", "w") as f_err:
            traceback.print_exc(file=f_err)
            f_err.write(f"\nError seeding PoC: {e}")
        print(f"Error seeding PoC: {e}. Check error_seeder.log for details.")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_poc()
