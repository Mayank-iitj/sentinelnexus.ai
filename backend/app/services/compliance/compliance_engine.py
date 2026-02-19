from typing import List, Dict, Any
from datetime import datetime


class ComplianceEngine:
    
    @staticmethod
    def assess_gdpr_compliance(pii_findings: List, code_findings: List) -> Dict[str, Any]:
        """Assess GDPR compliance based on PII and code security findings"""
        
        gdpr_checklist = {
            'data_minimization': True,
            'purpose_limitation': True,
            'storage_limitation': True,
            'integrity_confidentiality': True,
            'processing_transparency': True,
        }
        
        # Check for data minimization violations
        if any(f.pii_type in ['email', 'phone', 'ssn'] for f in pii_findings if hasattr(f, 'pii_type')):
            gdpr_checklist['data_minimization'] = False
        
        # Check for encryption/security violations
        insecure_storage_count = sum(1 for f in code_findings if 'unencrypted_storage' in str(f.finding_type))
        if insecure_storage_count > 0:
            gdpr_checklist['integrity_confidentiality'] = False
        
        status = 'compliant' if all(gdpr_checklist.values()) else 'non_compliant'
        
        return {
            'status': status,
            'checklist': gdpr_checklist,
            'violations': sum(1 for v in gdpr_checklist.values() if not v),
            'recommendations': ComplianceEngine._get_gdpr_recommendations(gdpr_checklist)
        }
    
    @staticmethod
    def assess_ai_act_compliance(risk_score: float, pii_findings: List) -> Dict[str, Any]:
        """Assess AI Act compliance"""
        
        compliance_status = {
            'high_risk_system': risk_score > 75,
            'prohibited_practices': False,
            'transparency_requirements': True,
            'documentation': True,
        }
        
        if sum(1 for f in pii_findings if hasattr(f, 'pii_type')) > 5:
            compliance_status['prohibited_practices'] = True
        
        overall_status = 'compliant' if not compliance_status['prohibited_practices'] else 'non_compliant'
        
        return {
            'status': overall_status,
            'checklist': compliance_status,
            'risk_level_classification': 'high_risk' if risk_score > 75 else 'general_purpose',
            'requirements': ComplianceEngine._get_ai_act_requirements(risk_score)
        }
    
    @staticmethod
    def generate_audit_report(scan_results: Dict, pii_findings: List, code_findings: List) -> Dict[str, Any]:
        """Generate comprehensive audit report for SOC2 / Enterprise compliance"""
        
        gdpr = ComplianceEngine.assess_gdpr_compliance(pii_findings, code_findings)
        ai_act = ComplianceEngine.assess_ai_act_compliance(
            scan_results.get('ai_risk_score', 0), pii_findings
        )
        
        return {
            'audit_date': datetime.utcnow().isoformat(),
            'audit_type': 'AI Compliance Risk Assessment',
            'overall_status': 'compliant' if gdpr['status'] == 'compliant' and ai_act['status'] == 'compliant' else 'non_compliant',
            'gdpr': gdpr,
            'ai_act': ai_act,
            'findings_count': len(code_findings) + len(pii_findings),
            'critical_findings': sum(1 for f in code_findings if 'critical' in str(f.severity)),
            'remediation_priority': ComplianceEngine._get_remediation_priority(scan_results),
        }
    
    @staticmethod
    def _get_gdpr_recommendations(checklist: Dict) -> List[str]:
        recommendations = []
        
        if not checklist.get('data_minimization'):
            recommendations.append("Implement strict data minimization - collect only necessary PII")
        if not checklist.get('storage_limitation'):
            recommendations.append("Define and enforce data retention policies")
        if not checklist.get('integrity_confidentiality'):
            recommendations.append("Implement encryption at rest and in transit")
        if not checklist.get('processing_transparency'):
            recommendations.append("Document all data processing activities and create DPA")
        
        return recommendations
    
    @staticmethod
    def _get_ai_act_requirements(risk_score: float) -> List[str]:
        requirements = []
        
        if risk_score > 75:
            requirements.extend([
                "Implement high-risk AI governance framework",
                "Conduct risk assessments before deployment",
                "Maintain audit logs of all decisions",
                "Implement human oversight mechanisms",
            ])
        else:
            requirements.extend([
                "Provide transparency about AI use",
                "Maintain basic documentation",
                "Ensure user consent",
            ])
        
        return requirements
    
    @staticmethod
    def _get_remediation_priority(scan_results: Dict) -> List[Dict]:
        priority = []
        
        risk_score = scan_results.get('ai_risk_score', 0)
        
        if risk_score >= 75:
            priority.append({
                'level': 'critical',
                'action': 'Immediate remediation required',
                'timeline': '24-48 hours'
            })
        elif risk_score >= 50:
            priority.append({
                'level': 'high',
                'action': 'Schedule remediation within 1 week',
                'timeline': '7 days'
            })
        else:
            priority.append({
                'level': 'medium',
                'action': 'Plan remediation',
                'timeline': '30 days'
            })
        
        return priority
