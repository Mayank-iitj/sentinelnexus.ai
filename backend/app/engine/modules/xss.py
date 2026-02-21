import httpx
import re
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class XSSModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "Cross-Site Scripting (XSS)"

    @property
    def module_id(self) -> str:
        return "engine.modules.xss"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        payloads = [
            "<script>alert('XSS')</script>",
            "\"><script>alert('XSS')</script>",
            "';alert('XSS');",
            "<img src=x onerror=alert('XSS')>",
        ]
        
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            try:
                # Basic check for reflected XSS on typical parameters
                params = config.get("params", ["q", "id", "search", "name"])
                for param in params:
                    for payload in payloads:
                        test_url = target_url
                        if "?" in test_url:
                            test_url += f"&{param}={payload}"
                        else:
                            test_url += f"?{param}={payload}"
                        
                        resp = await client.get(test_url)
                        if payload in resp.text:
                            findings.append(Finding(
                                id=f"xss_{param}_{hash(payload)}",
                                title="Reflected XSS Detected",
                                description=f"The application reflects input from the '{param}' parameter without proper sanitization.",
                                severity="High",
                                finding_type="reflected_xss",
                                location=f"URL parameter: {param}",
                                evidence=f"Payload found in response: {payload}",
                                remediation="Use context-aware output encoding (e.g., HTML entity encoding) and implement a strong Content Security Policy (CSP).",
                                cwe_refs=["CWE-79"]
                            ))
                            break # Found one for this param
            except Exception as e:
                # In a real system, we'd log this to a proper audit log
                pass
                
        return findings
