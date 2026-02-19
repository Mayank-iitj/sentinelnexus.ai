import pytest
from app.services.scanners.pii_scanner import PIIDetectionEngine


def test_detect_email():
    """Test email PII detection"""
    
    content = "Contact us at admin@example.com or support@company.org"
    findings, risk_score = PIIDetectionEngine.scan_for_pii(content)
    
    assert len(findings) > 0
    assert any(f.pii_type == "email" for f in findings)
    assert risk_score > 0


def test_detect_phone_number():
    """Test phone number PII detection"""
    
    content = "Call us at (555) 123-4567 or +1 555-987-6543"
    findings, risk_score = PIIDetectionEngine.scan_for_pii(content)
    
    assert len(findings) > 0
    assert any(f.pii_type == "phone" for f in findings)


def test_detect_credit_card():
    """Test credit card PII detection"""
    
    content = "Card: 4532-1488-0343-6467"
    findings, risk_score = PIIDetectionEngine.scan_for_pii(content)
    
    assert len(findings) > 0
    assert any(f.pii_type == "credit_card" for f in findings)
    assert risk_score > 25  # Highly sensitive


def test_detect_ssn():
    """Test SSN detection"""
    
    content = "SSN: 123-45-6789"
    findings, risk_score = PIIDetectionEngine.scan_for_pii(content)
    
    assert len(findings) > 0
    assert any(f.pii_type == "ssn" for f in findings)


def test_no_pii_detected():
    """Test content without PII"""
    
    content = "This is a safe document with no personal information."
    findings, risk_score = PIIDetectionEngine.scan_for_pii(content)
    
    assert len(findings) == 0
    assert risk_score == 0.0


def test_compliance_risk_assessment():
    """Test GDPR and AI Act compliance risk assessment"""
    
    from app.services.scanners.pii_scanner import PIIFinding
    
    findings = [
        PIIFinding(
            pii_type="email",
            classifications="sensitive",
            detected_count=1,
            gdpr_risk="high",
            ai_act_risk="medium",
            remediation="Use hashing"
        )
    ]
    
    risks = PIIDetectionEngine.get_compliance_risks(findings)
    
    assert "gdpr_violations" in risks
    assert "ai_act_violations" in risks
