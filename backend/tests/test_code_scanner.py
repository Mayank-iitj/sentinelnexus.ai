import pytest
from app.services.scanners.code_scanner import CodeSecurityScanner


def test_detect_hardcoded_api_key():
    """Test detection of hardcoded API keys"""
    
    code = """
    api_key = "sk-1234567890abcdefghij"
    secret = "my_secret_key_12345678"
    """
    
    findings, risk_score = CodeSecurityScanner.scan_code(code)
    
    assert len(findings) > 0
    assert any(f.finding_type == "hardcoded_api_key" for f in findings)
    assert risk_score > 0


def test_detect_email_pii():
    """Test detection of email PII"""
    
    code = """
    email = "user@example.com"
    contact = "admin@company.org"
    """
    
    findings, risk_score = CodeSecurityScanner.scan_code(code)
    
    assert len(findings) > 0
    assert risk_score > 0


def test_detect_dangerous_functions():
    """Test detection of dangerous Python functions"""
    
    code = """import pickle
data = eval(user_input)
result = exec(dynamic_code)
"""
    
    findings, risk_score = CodeSecurityScanner.scan_code(code)
    
    # Check for either dangerous_function_call or unsafe_patterns
    assert any(f.finding_type in ["dangerous_function_call", "unsafe_pattern", "dangerous_deserialization"] for f in findings)
    assert risk_score > 10


def test_risk_level_classification():
    """Test risk level classification"""
    
    assert CodeSecurityScanner.get_risk_level(90) == "critical"
    assert CodeSecurityScanner.get_risk_level(60) == "high"
    assert CodeSecurityScanner.get_risk_level(30) == "medium"
    assert CodeSecurityScanner.get_risk_level(10) == "low"


def test_empty_code_scan():
    """Test scanning empty code"""
    
    code = ""
    findings, risk_score = CodeSecurityScanner.scan_code(code)
    
    assert len(findings) == 0
    assert risk_score == 0.0


def test_safe_code_scan():
    """Test scanning safe code"""
    
    code = """
    def hello_world():
        message = "Hello, World!"
        print(message)
        return message
    """
    
    findings, risk_score = CodeSecurityScanner.scan_code(code)
    
    # Safe code should have minimal findings
    assert risk_score < 10
