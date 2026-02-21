import asyncio
from typing import Dict, Any
from .celery_app import celery_app
from app.engine.orchestrator import EngineOrchestrator
from app.services.scanners.risk_engine import RiskEngine

@celery_app.task(name="app.worker.tasks.run_vulnerability_scan")
def run_vulnerability_scan(target_url: str, config: Dict[str, Any] = {}):
    """
    Celery task to run a full vulnerability scan.
    """
    orchestrator = EngineOrchestrator()
    
    # Run the async orchestrator in a thread-safe way for Celery
    loop = asyncio.get_event_loop()
    if loop.is_closed():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
    findings = loop.run_until_complete(orchestrator.run_full_scan(target_url, config))
    
    # Risk Scoring and Enrichment
    enriched_findings = RiskEngine.enrich_findings(findings)
    risk_summary = RiskEngine.aggregate_risk_score(enriched_findings)
    
    # Serialize findings for Celery result
    serialized_findings = [f.model_dump() for f in enriched_findings]
    
    return {
        "target_url": target_url,
        "total_findings": len(serialized_findings),
        "findings": serialized_findings,
        "risk_metrics": risk_summary,
        "status": "completed"
    }
