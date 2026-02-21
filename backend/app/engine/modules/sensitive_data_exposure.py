import httpx
import re
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class SensitiveDataExposureModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "Sensitive Data Exposure (API)"

    @property
    def module_id(self) -> str:
        return "engine.modules.sensitive_data"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        patterns = [
            (r'("password"\s*:\s*"[^"]+")', "Hardcoded Password", "Critical"),
            (r'("api_key"\s*:\s*"[A-Za-z0-9_-]{32,}")', "API Key Exposure", "High"),
            (r'([0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4})', "Credit Card Number", "Critical"),
            (r'(?i)(database_url|connection_string)\s*:\s*"[^"]+"', "Database Connection String", "High")
        ]
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                resp = await client.get(target_url)
                for pattern, title, severity in patterns:
                    match = re.search(pattern, resp.text)
                    if match:
                        findings.append(Finding(
                            id=f"exposure_{title.lower().replace(' ', '_')}",
                            title=f"Insecure Data Exposure: {title}",
                            description=f"Sensitive information was found in the API response or public page content.",
                            severity=severity,
                            finding_type="info_leak",
                            location=target_url,
                            evidence=f"Matched pattern: {match.group(1)[:50]}...",
                            remediation="Ensure sensitive data is never returned in API responses or public-facing pages. Use masked fields or backend-only logic.",
                            cwe_refs=["CWE-200", "CWE-312"]
                        ))
            except Exception:
                pass
        return findings
