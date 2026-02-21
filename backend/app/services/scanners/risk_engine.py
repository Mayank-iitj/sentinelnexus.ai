from typing import List, Dict, Any
from ..engine.modules.base_module import Finding

class RiskEngine:
    @staticmethod
    def calculate_cvss(severity: str) -> float:
        """Simplified CVSS 3.1 Base Score calculation based on severity"""
        scores = {
            "Critical": 9.5,
            "High": 8.0,
            "Medium": 5.5,
            "Low": 3.0,
            "Info": 0.0
        }
        return scores.get(severity, 5.0)

    @staticmethod
    def assess_business_impact(finding: Finding) -> str:
        """Heuristic-based business impact assessment"""
        impact_map = {
            "remote_code_execution": "Full system takeover and data exfiltration.",
            "sql_injection": "Complete database access and potential user impersonation.",
            "bola": "Unauthorized access to other users' private data.",
            "ssrf_cloud_metadata": "Exposure of internal cloud credentials and infrastructure.",
            "xss": "Session hijacking and defacement of the user interface.",
            "idor": "Exposure of unauthorized individual records.",
            "s3_public_bucket": "Public exposure of potentially sensitive cloud storage files."
        }
        return impact_map.get(finding.finding_type, "Generalized risk to application integrity.")

    @staticmethod
    def aggregate_risk_score(findings: List[Finding]) -> Dict[str, Any]:
        """Calculates global risk metrics for a scan"""
        if not findings:
            return {"score": 0, "level": "Secure", "confidence": 100}
            
        base_scores = [RiskEngine.calculate_cvss(f.severity) for f in findings]
        avg_score = sum(base_scores) / len(base_scores)
        max_score = max(base_scores)
        
        # Weighted score (more weight on criticals/highs)
        weighted_score = (max_score * 0.7) + (avg_score * 0.3)
        
        level = "Safe"
        if weighted_score >= 9.0: level = "Critical"
        elif weighted_score >= 7.0: level = "High"
        elif weighted_score >= 4.0: level = "Medium"
        elif weighted_score > 0: level = "Low"
        
        return {
            "score": round(weighted_score, 1),
            "level": level,
            "confidence": 92, # Placeholder for AI-confidence logic
            "finding_count": len(findings)
        }

    @staticmethod
    def is_false_positive_likely(finding: Finding, resp_text: str = "") -> bool:
        """Heuristic to detect likely false positives"""
        # 1. Check for 'error' in response for successful detections
        if "error" in resp_text.lower() and finding.finding_type == "sql_injection":
            return False # Likely true positive
            
        # 2. Check for generic '404' or 'not found' which might trigger false hits on params
        if "404 not found" in resp_text.lower():
            return True
            
        # 3. Frequency check (if too many identical findings in one scan)
        # (Usually implemented in the aggregator)
        
        return False

    @staticmethod
    def enrich_findings(findings: List[Finding]) -> List[Finding]:
        """Enriches each finding with risk metadata and reduction confidence"""
        for f in findings:
            f.metadata["cvss_score"] = RiskEngine.calculate_cvss(f.severity)
            f.metadata["business_impact"] = RiskEngine.assess_business_impact(f)
            f.metadata["exploitability"] = "High" if f.severity in ["Critical", "High"] else "Medium"
            # Add confidence score
            f.metadata["confidence_score"] = 95 if not RiskEngine.is_false_positive_likely(f) else 40
        return findings
