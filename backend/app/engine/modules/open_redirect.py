import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class OpenRedirectModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "Open Redirect"

    @property
    def module_id(self) -> str:
        return "engine.modules.open_redirect"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        payloads = [
            "https://evil.com",
            "//evil.com",
            "/\evil.com",
            "https://sentinelnexus.ai@evil.com",
        ]
        
        async with httpx.AsyncClient(timeout=5.0, follow_redirects=False) as client:
            params = config.get("params", ["url", "redirect", "next", "goto", "return"])
            for param in params:
                for payload in payloads:
                    test_url = target_url
                    sep = "&" if "?" in test_url else "?"
                    test_url += f"{sep}{param}={payload}"
                    
                    try:
                        resp = await client.get(test_url)
                        # Check for 30x status and Location header matching payload
                        if resp.status_code in [301, 302, 303, 307, 308]:
                            location = resp.headers.get("Location", "")
                            if payload in location:
                                findings.append(Finding(
                                    id=f"redir_{param}_{hash(payload)}",
                                    title="Open Redirect Detected",
                                    description=f"The application redirects users to an arbitrary external URL from the '{param}' parameter.",
                                    severity="Medium",
                                    finding_type="open_redirect",
                                    location=f"URL parameter: {param}",
                                    evidence=f"Redirect Location header: {location}",
                                    remediation="Use an internal allowlist for redirect destinations. Avoid using full URLs in redirect parameters; use identifiers or relative paths instead.",
                                    cwe_refs=["CWE-601"]
                                ))
                                break
                    except Exception:
                        pass
        return findings
