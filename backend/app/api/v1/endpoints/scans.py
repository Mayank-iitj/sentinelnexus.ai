from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.project import Project
from app.models.scan import Scan, ScanResult
from app.schemas.scan import ScanResponse, CodeScanRequest, PromptScanRequest, MonitoringScanRequest, ScanDetailResponse
from app.services.scanners.code_scanner import CodeSecurityScanner
from app.services.scanners.prompt_scanner import PromptInjectionScanner
from app.services.scanners.pii_scanner import PIIDetectionEngine
from app.services.compliance.compliance_engine import ComplianceEngine
from datetime import datetime
import uuid
import zipfile
import io

router = APIRouter(prefix="/api/v1/scans", tags=["scans"])


@router.post("/code", response_model=ScanResponse)
def scan_code(scan_request: CodeScanRequest, db: Session = Depends(get_db)):
    """Scan code for security vulnerabilities"""
    
    project = db.query(Project).filter(Project.id == scan_request.project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Create scan record
    scan = Scan(
        id=str(uuid.uuid4()),
        project_id=scan_request.project_id,
        scan_type="code",
        status="running"
    )
    db.add(scan)
    db.commit()
    
    # Perform scanning
    findings, risk_score = CodeSecurityScanner.scan_code(scan_request.code_content)
    
    # Save findings
    for finding in findings:
        result = ScanResult(
            id=str(uuid.uuid4()),
            scan_id=scan.id,
            finding_type=finding.finding_type,
            severity=finding.severity,
            file_path=finding.file_path,
            line_number=finding.line_number,
            description=finding.description,
            code_snippet=finding.code_snippet,
            remediation=finding.remediation,
            metadata=finding.metadata
        )
        db.add(result)
    
    # Update scan with results
    risk_level = CodeSecurityScanner.get_risk_level(risk_score)
    scan.ai_risk_score = risk_score
    scan.risk_level = risk_level
    scan.status = "completed"
    scan.completed_at = datetime.utcnow()
    scan.findings_summary = {
        "total_findings": len(findings),
        "critical": sum(1 for f in findings if f.severity == "critical"),
        "high": sum(1 for f in findings if f.severity == "high"),
        "medium": sum(1 for f in findings if f.severity == "medium"),
        "low": sum(1 for f in findings if f.severity == "low"),
    }
    
    db.commit()
    db.refresh(scan)
    
    return scan


@router.post("/prompt", response_model=ScanResponse)
def scan_prompt(scan_request: PromptScanRequest, db: Session = Depends(get_db)):
    """Scan prompt for injection vulnerabilities"""
    
    project = db.query(Project).filter(Project.id == scan_request.project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Create scan record
    scan = Scan(
        id=str(uuid.uuid4()),
        project_id=scan_request.project_id,
        scan_type="prompt",
        status="running"
    )
    db.add(scan)
    db.commit()
    
    # Scan prompt
    risk_score, risk_details = PromptInjectionScanner.scan_prompt(scan_request.prompt_text)
    risk_level = PromptInjectionScanner.get_risk_level(risk_score)
    
    # Generate suggestions
    suggestions = PromptInjectionScanner.generate_remediation_suggestions(risk_details)
    safer_prompt = PromptInjectionScanner.generate_safer_prompt(scan_request.prompt_text, risk_details)
    
    # Update scan
    scan.ai_risk_score = risk_score
    scan.risk_level = risk_level
    scan.status = "completed"
    scan.completed_at = datetime.utcnow()
    scan.findings_summary = {
        "jailbreak_susceptibility": risk_details.get("jailbreak_susceptibility", 0),
        "injection_risk": risk_details.get("injection_risk", 0),
        "data_exfiltration_risk": risk_details.get("data_exfiltration_risk", 0),
        "system_prompt_exposure": risk_details.get("system_prompt_exposure", 0),
        "remediation_suggestions": suggestions,
        "suggested_safer_prompt": safer_prompt,
    }
    
    db.commit()
    db.refresh(scan)
    
    return scan


@router.post("/pii", response_model=ScanResponse)
def scan_pii(scan_request: CodeScanRequest, db: Session = Depends(get_db)):
    """Scan for PII and sensitive data"""
    
    project = db.query(Project).filter(Project.id == scan_request.project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Create scan record
    scan = Scan(
        id=str(uuid.uuid4()),
        project_id=scan_request.project_id,
        scan_type="pii",
        status="running"
    )
    db.add(scan)
    db.commit()
    
    # Scan for PII
    pii_findings, pii_risk_score = PIIDetectionEngine.scan_for_pii(scan_request.code_content)
    
    # Save findings
    for finding in pii_findings:
        result = ScanResult(
            id=str(uuid.uuid4()),
            scan_id=scan.id,
            finding_type=finding.pii_type,
            severity="high" if finding.classifications == "highly_sensitive" else "medium",
            description=f"PII detected: {finding.pii_type} ({finding.detected_count} occurrences)",
            remediation=finding.remediation,
            metadata={
                "pii_type": finding.pii_type,
                "count": finding.detected_count,
                "classification": finding.classifications,
                "gdpr_risk": finding.gdpr_risk,
                "ai_act_risk": finding.ai_act_risk,
            }
        )
        db.add(result)
    
    # Compliance assessment
    code_findings = []
    compliance_report = ComplianceEngine.generate_audit_report(
        {"ai_risk_score": pii_risk_score},
        pii_findings,
        code_findings
    )
    
    # Update scan
    scan.ai_risk_score = pii_risk_score
    scan.risk_level = CodeSecurityScanner.get_risk_level(pii_risk_score)
    scan.status = "completed"
    scan.completed_at = datetime.utcnow()
    scan.findings_summary = {
        "pii_types_found": len(pii_findings),
        "total_pii_instances": sum(f.detected_count for f in pii_findings),
        "gdpr_compliance": compliance_report["gdpr"]["status"],
        "ai_act_compliance": compliance_report["ai_act"]["status"],
    }
    
    db.commit()
    db.refresh(scan)
    
    return scan


@router.get("/{scan_id}", response_model=ScanDetailResponse)
def get_scan(scan_id: str, db: Session = Depends(get_db)):
    """Get scan details with all results"""
    
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )
    
    return scan


@router.get("/project/{project_id}", response_model=list)
def list_project_scans(project_id: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """List all scans for a project"""
    
    scans = db.query(Scan).filter(
        Scan.project_id == project_id
    ).order_by(Scan.created_at.desc()).offset(skip).limit(limit).all()
    
    return scans
