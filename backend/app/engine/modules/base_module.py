import abc
from typing import List, Dict, Any
from pydantic import BaseModel

class Finding(BaseModel):
    id: str
    title: str
    description: str
    severity: str  # Critical, High, Medium, Low, Info
    finding_type: str
    location: str
    evidence: str
    remediation: str
    cwe_refs: List[str] = []
    metadata: Dict[str, Any] = {}

class BaseScannerModule(abc.ABC):
    """
    Base class for all SentinelNexus scanning modules.
    Each module should implement the scan method.
    """
    
    @property
    @abc.abstractmethod
    def name(self) -> str:
        """The name of the scanner module (e.g., 'SQL Injection')"""
        pass

    @property
    @abc.abstractmethod
    def module_id(self) -> str:
        """Unique identifier for the module (e.g., 'engine.modules.sqli')"""
        pass

    @abc.abstractmethod
    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        """
        Executes the scan module against the target URL.
        """
        pass
