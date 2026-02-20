
import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.getcwd())

from app.services.scanners.code_scanner import CodeSecurityScanner
from app.services.scanners.pii_scanner import PIIDetectionEngine

def run_code_scanner_demo():
    print("\n--- Code Security Scanner Demo ---")
    
    unsafe_code = """
import os
import json

def process_data(data):
    # Hardcoded API Key - BAD
    api_key = "sk-1234567890abcdef1234567890abcdef" 
    
    # Unsafe deserialization - BAD
    obj = json.loads(data)
    
    # Dangerous eval - BAD
    eval(data)
    
    print(f"Processing with {api_key}")
"""
    print("Scanning Code Snippet...")
    findings, risk_score = CodeSecurityScanner.scan_code(unsafe_code)
    
    print(f"Risk Score: {risk_score}")
    print(f"Risk Level: {CodeSecurityScanner.get_risk_level(risk_score)}")
    
    if findings:
        print("Findings:")
        for f in findings:
            print(f"  - [{f.severity.upper()}] {f.finding_type}: {f.description}")
            print(f"    Line {f.line_number}: {f.code_snippet.strip()}")

def run_pii_scanner_demo():
    print("\n\n--- PII Detection Engine Demo ---")
    
    text_with_pii = """
Hello,
Please contact me at john.doe@example.com regarding the issue.
My phone number is 555-0199-8888.
We processed the payment for card 4532-1234-5678-9012 yesterday.
"""
    print("Scanning Text with PII...")
    findings, risk_score = PIIDetectionEngine.scan_for_pii(text_with_pii)
    
    print(f"Risk Score: {risk_score}")
    
    if findings:
        print("Findings:")
        for f in findings:
            print(f"  - {f.pii_type} ({f.detected_count} found)")
            print(f"    Risk: GDPR={f.gdpr_risk}, AI Act={f.ai_act_risk}")
            print(f"    Remediation: {f.remediation}")

if __name__ == "__main__":
    run_code_scanner_demo()
    run_pii_scanner_demo()
