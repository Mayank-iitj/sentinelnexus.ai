import re
from typing import List, Dict, Tuple, Any
from dataclasses import dataclass


@dataclass
class PIIFinding:
    pii_type: str
    classifications: str
    detected_count: int
    gdpr_risk: str
    ai_act_risk: str
    remediation: str


class PIIDetectionEngine:
    
    PII_DEFINITIONS = {
        'email': {
            'pattern': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'classification': 'sensitive',
            'gdpr_risk': 'high',
            'ai_act_risk': 'medium',
        },
        'phone': {
            'pattern': r'(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b',
            'classification': 'sensitive',
            'gdpr_risk': 'high',
            'ai_act_risk': 'medium',
        },
        'credit_card': {
            'pattern': r'\b(?:\d[ -]*?){13,19}\b',
            'classification': 'highly_sensitive',
            'gdpr_risk': 'critical',
            'ai_act_risk': 'high',
        },
        'ssn': {
            'pattern': r'\b\d{3}-\d{2}-\d{4}\b',
            'classification': 'highly_sensitive',
            'gdpr_risk': 'critical',
            'ai_act_risk': 'high',
        },
        'aadhaar': {
            'pattern': r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',
            'classification': 'highly_sensitive',
            'gdpr_risk': 'critical',
            'ai_act_risk': 'high',
        },
        'passport': {
            'pattern': r'\b[A-Z]{1,2}\d{6,9}\b',
            'classification': 'highly_sensitive',
            'gdpr_risk': 'high',
            'ai_act_risk': 'high',
        },
        'ip_address': {
            'pattern': r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
            'classification': 'sensitive',
            'gdpr_risk': 'medium',
            'ai_act_risk': 'low',
        },
        'license_plate': {
            'pattern': r'\b[A-Z]{2,3}[\s-]?\d{1,4}[\s-]?[A-Z]{2}\b',
            'classification': 'sensitive',
            'gdpr_risk': 'medium',
            'ai_act_risk': 'low',
        },
    }
    
    @staticmethod
    def scan_for_pii(content: str, file_path: str = "") -> Tuple[List[PIIFinding], float]:
        findings = []
        risk_score = 0.0
        detected_pii_types = set()
        
        lines = content.split('\n')
        
        for pii_type, definition in PIIDetectionEngine.PII_DEFINITIONS.items():
            pattern = definition['pattern']
            count = 0
            
            for line_num, line in enumerate(lines, 1):
                matches = re.finditer(pattern, line)
                for match in matches:
                    count += 1
                    detected_pii_types.add(pii_type)
                    
                    # Calculate risk contribution
                    if definition['classification'] == 'highly_sensitive':
                        risk_score += 25.0
                    elif definition['classification'] == 'sensitive':
                        risk_score += 10.0
                    else:
                        risk_score += 5.0
            
            if count > 0:
                finding = PIIFinding(
                    pii_type=pii_type,
                    classifications=definition['classification'],
                    detected_count=count,
                    gdpr_risk=definition['gdpr_risk'],
                    ai_act_risk=definition['ai_act_risk'],
                    remediation=PIIDetectionEngine._get_remediation(pii_type)
                )
                findings.append(finding)
        
        risk_score = min(risk_score, 100.0)
        
        return findings, risk_score
    
    @staticmethod
    def _get_remediation(pii_type: str) -> str:
        remediations = {
            'email': 'Use email hashing or masking. Implement data minimization principles.',
            'phone': 'Remove phone numbers from code. Use secure communication channels.',
            'credit_card': 'NEVER store credit cards in code. Use PCI-DSS compliant payment processors.',
            'ssn': 'Remove SSN from codebase. Use tokenization if needed.',
            'aadhaar': 'Remove Aadhaar numbers. Comply with UIDAI regulations.',
            'passport': 'Remove passport numbers. Use secure document storage.',
            'ip_address': 'Use privacy-preserving logging. Implement data anonymization.',
            'license_plate': 'Remove license plates from logs. Use obfuscation techniques.',
        }
        return remediations.get(pii_type, 'Implement PII detection and masking.')
    
    @staticmethod
    def get_compliance_risks(findings: List[PIIFinding]) -> Dict[str, Any]:
        gdpr_risks = []
        ai_act_risks = []
        
        for finding in findings:
            if finding.gdpr_risk == 'critical':
                gdpr_risks.append({'pii_type': finding.pii_type, 'risk': 'critical'})
            if finding.ai_act_risk in ['high', 'critical']:
                ai_act_risks.append({'pii_type': finding.pii_type, 'risk': finding.ai_act_risk})
        
        return {
            'gdpr_violations': len([r for r in gdpr_risks if r['risk'] == 'critical']),
            'ai_act_violations': len([r for r in ai_act_risks if r['risk'] == 'critical']),
            'high_risk_items': gdpr_risks + ai_act_risks,
        }
    
    @staticmethod
    def generate_data_flow_report(findings: List[PIIFinding]) -> Dict[str, Any]:
        return {
            'total_pii_types_found': len(findings),
            'pii_breakdown': {f.pii_type: f.detected_count for f in findings},
            'highest_risk_type': max(findings, key=lambda f: f.gdpr_risk).pii_type if findings else None,
            'compliance_recommendations': [
                'Implement PII detection and masking in data pipelines',
                'Use Presidio or similar tools for automated PII detection',
                'Add encryption at rest for sensitive data',
                'Implement field-level encryption for PII',
                'Regular audits of codebase for PII leaks',
            ]
        }
