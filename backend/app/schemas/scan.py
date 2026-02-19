from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class ScanRequestBase(BaseModel):
    project_id: str
    scan_type: str  # code, prompt, pii, monitoring


class CodeScanRequest(ScanRequestBase):
    code_content: Optional[str] = None
    file_paths: Optional[List[str]] = None


class PromptScanRequest(ScanRequestBase):
    prompt_text: str


class MonitoringScanRequest(ScanRequestBase):
    api_logs: Optional[str] = None
    output_logs: Optional[str] = None


class ScanResultResponse(BaseModel):
    id: str
    finding_type: str
    severity: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    description: Optional[str] = None
    code_snippet: Optional[str] = None
    remediation: Optional[str] = None
    is_reviewed: bool
    is_resolved: bool
    metadata: Dict[str, Any] = {}
    created_at: datetime
    
    class Config:
        from_attributes = True


class ScanResponse(BaseModel):
    id: str
    project_id: str
    scan_type: str
    status: str
    ai_risk_score: float
    risk_level: Optional[str] = None
    findings_summary: Dict[str, Any] = {}
    file_count: int
    execution_time_seconds: Optional[int] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    is_archived: bool
    
    class Config:
        from_attributes = True


class ScanDetailResponse(ScanResponse):
    results: List[ScanResultResponse] = []
