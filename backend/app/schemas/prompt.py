from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class PromptScanResponse(BaseModel):
    id: str
    project_id: Optional[str] = None
    prompt_text: str
    risk_score: float
    risk_level: Optional[str] = None
    jailbreak_susceptibility: float
    injection_risk: float
    data_exfiltration_risk: float
    system_prompt_exposure: float
    detected_risks: List[str] = []
    remediation_suggestions: List[str] = []
    suggested_prompt: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
