import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class SSRFModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "Server-Side Request Forgery (SSRF)"

    @property
    def module_id(self) -> str:
        return "engine.modules.ssrf"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        # Payloads targeting localhost and cloud metadata services
        payloads = [
            "http://localhost",
            "http://127.0.0.1",
            "http://169.254.169.254/latest/meta-data/", # AWS/GCP Metadata
            "http://metadata.google.internal/computeMetadata/v1/", # Google Cloud
        ]
        
        async with httpx.AsyncClient(timeout=5.0) as client:
            params = config.get("params", ["url", "dest", "uri", "path", "api"])
            for param in params:
                for payload in payloads:
                    test_url = target_url
                    sep = "&" if "?" in test_url else "?"
                    test_url += f"{sep}{param}={payload}"
                    
                    try:
                        # We use a short timeout and look for responses indicating server-side interaction
                        resp = await client.get(test_url)
                        # Basic heuristics for SSRF
                        if "meta-data" in resp.text.lower() or "instance-id" in resp.text.lower():
                            findings.append(Finding(
                                id=f"ssrf_{param}_{hash(payload)}",
                                title="Potential SSRF via Cloud Metadata",
                                description=f"The application appears to fetch content from an internal cloud metadata service via the '{param}' parameter.",
                                severity="Critical",
                                finding_type="ssrf_cloud_metadata",
                                location=f"URL parameter: {param}",
                                evidence=f"Metadata signature found in response to payload: {payload}",
                                remediation="Implement a strict allowlist of allowed protocols and domains. Do not allow requests to internal or loopback addresses.",
                                cwe_refs=["CWE-918"]
                            ))
                            break
                    except Exception:
                        pass
        return findings
