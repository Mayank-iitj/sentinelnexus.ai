import re
import ast
from typing import List, Dict, Tuple, Any
from dataclasses import dataclass


@dataclass
class ScanFinding:
    finding_type: str
    severity: str
    file_path: str
    line_number: int
    description: str
    code_snippet: str
    remediation: str
    metadata: Dict[str, Any]


class CodeSecurityScanner:
    
    # Pattern definitions for various security issues
    HARDCODED_API_KEYS = [
        r'(?:api_key|apikey|api-key)\s*=\s*["\']([a-zA-Z0-9\-_]{20,})["\']',
        r'(?:sk-|sk_)[a-zA-Z0-9]{20,}',
        r'(?:token|password)\s*=\s*["\']([a-zA-Z0-9\-_]{20,})["\']',
    ]
    
    PII_PATTERNS = {
        'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        'phone': r'(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b',
        'credit_card': r'\b(?:\d[ -]*?){13,19}\b',
        'aadhaar': r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',
        'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
    }
    
    UNSAFE_PATTERNS = {
        'unsafe_logging': r'print\(.*?(?:password|token|api_key|secret)',
        'unencrypted_storage': r'(?:open|write)\(.*?(?:password|token|secret)',
        'dangerous_deserialization': r'(?:pickle|yaml\.load|json\.loads)',
        'sql_injection_risk': r'(?:execute|query)\s*\(\s*["\'].*?{.*?}',
    }
    
    @staticmethod
    def scan_code(code_content: str, file_path: str = "code.py") -> Tuple[List[ScanFinding], float]:
        findings = []
        risk_score = 0.0
        
        lines = code_content.split('\n')
        
        # Check for hardcoded API keys
        for line_num, line in enumerate(lines, 1):
            for pattern in CodeSecurityScanner.HARDCODED_API_KEYS:
                if re.search(pattern, line, re.IGNORECASE):
                    findings.append(ScanFinding(
                        finding_type="hardcoded_api_key",
                        severity="critical",
                        file_path=file_path,
                        line_number=line_num,
                        description="Hardcoded API key detected. This is a critical security vulnerability.",
                        code_snippet=line.strip(),
                        remediation="Use environment variables or secure secret management (AWS Secrets Manager, HashiCorp Vault).",
                        metadata={"pattern_type": "api_key"}
                    ))
                    risk_score += 25.0
        
        # Check for PII exposure
        for pii_type, pattern in CodeSecurityScanner.PII_PATTERNS.items():
            for line_num, line in enumerate(lines, 1):
                if re.search(pattern, line):
                    findings.append(ScanFinding(
                        finding_type=f"pii_exposed_{pii_type}",
                        severity="high",
                        file_path=file_path,
                        line_number=line_num,
                        description=f"Potential {pii_type.replace('_', ' ')} detected in code.",
                        code_snippet=line.strip()[:100],
                        remediation="Remove PII from code. Use PII detection libraries like Presidio to mask sensitive data.",
                        metadata={"pii_type": pii_type}
                    ))
                    risk_score += 10.0
        
        # Check for unsafe patterns
        for pattern_name, pattern in CodeSecurityScanner.UNSAFE_PATTERNS.items():
            for line_num, line in enumerate(lines, 1):
                if re.search(pattern, line, re.IGNORECASE):
                    findings.append(ScanFinding(
                        finding_type=pattern_name,
                        severity="high",
                        file_path=file_path,
                        line_number=line_num,
                        description=f"Unsafe pattern detected: {pattern_name.replace('_', ' ')}",
                        code_snippet=line.strip()[:100],
                        remediation=f"Implement proper security practices for {pattern_name.replace('_', ' ')}.",
                        metadata={"pattern_name": pattern_name}
                    ))
                    risk_score += 15.0
        
        # AST-based analysis for Python
        try:
            tree = ast.parse(code_content)
            for node in ast.walk(tree):
                if isinstance(node, ast.Call):
                    if isinstance(node.func, ast.Name):
                        # Check for dangerous function calls
                        if node.func.id in ['eval', 'exec', 'pickle.loads', 'yaml.load']:
                            findings.append(ScanFinding(
                                finding_type="dangerous_function_call",
                                severity="critical",
                                file_path=file_path,
                                line_number=node.lineno,
                                description=f"Dangerous function call: {node.func.id}",
                                code_snippet="",
                                remediation=f"Avoid using {node.func.id}. Use safer alternatives.",
                                metadata={"function": node.func.id}
                            ))
                            risk_score += 20.0
        except SyntaxError:
            pass
        
        # Cap risk score at 100
        risk_score = min(risk_score, 100.0)
        
        return findings, risk_score
    
    @staticmethod
    def get_risk_level(risk_score: float) -> str:
        if risk_score >= 75:
            return "critical"
        elif risk_score >= 50:
            return "high"
        elif risk_score >= 25:
            return "medium"
        else:
            return "low"
