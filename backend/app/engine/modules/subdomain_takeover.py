import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class SubdomainTakeoverModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "Subdomain Takeover Detection"

    @property
    def module_id(self) -> str:
        return "engine.modules.subdomain_takeover"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        # Common fingerprints for dangling subdomains (GitHub Pages, Heroku, etc.)
        fingerprints = [
            {"service": "GitHub Pages", "msg": "There isn't a GitHub Pages site here", "severity": "High"},
            {"service": "Heroku", "msg": "No such app", "severity": "High"},
            {"service": "Fastly", "msg": "Fastly error: unknown domain", "severity": "Medium"},
            {"service": "AWS S3", "msg": "The specified bucket does not exist", "severity": "High"},
        ]
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                resp = await client.get(target_url)
                for fp in fingerprints:
                    if fp["msg"].lower() in resp.text.lower():
                        findings.append(Finding(
                            id=f"takeover_{fp['service'].lower().replace(' ', '_')}",
                            title=f"Potential {fp['service']} Subdomain Takeover",
                            description=f"The subdomain appears to point to a {fp['service']} resource that has been deleted but the DNS record remains.",
                            severity=fp["severity"],
                            finding_type="subdomain_takeover",
                            location=target_url,
                            evidence=f"Service signature found in response: '{fp['msg']}'",
                            remediation="Remove the stale DNS record (CNAME/Alias) pointing to the deleted resource. Claim the resource name on the provider if possible.",
                            cwe_refs=["CWE-912"]
                        ))
            except Exception:
                pass
        return findings
