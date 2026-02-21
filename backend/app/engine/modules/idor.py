import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class IDORModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "Insecure Direct Object Reference (IDOR)"

    @property
    def module_id(self) -> str:
        return "engine.modules.idor"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        # Simplified IDOR check looking for access to other numerical IDs
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            params = config.get("params", ["id", "user_id", "project_id"])
            for param in params:
                if f"{param}=" not in target_url:
                    continue
                
                try:
                    # Attempt to increment/decrement the ID
                    import re
                    match = re.search(f"{param}=(\d+)", target_url)
                    if match:
                        current_id = int(match.group(1))
                        test_ids = [current_id - 1, current_id + 1, 1, 100]
                        
                        original_resp = await client.get(target_url)
                        
                        for tid in test_ids:
                            if tid < 0: continue
                            test_url = target_url.replace(f"{param}={current_id}", f"{param}={tid}")
                            resp = await client.get(test_url)
                            
                            # Heuristic: if response size and status code are very similar or 200 OK
                            # and context changes (indicating we accessed another object)
                            if resp.status_code == 200 and abs(len(resp.text) - len(original_resp.text)) < 500:
                                findings.append(Finding(
                                    id=f"idor_{param}_{tid}",
                                    title="Potential IDOR Vulnerability",
                                    description=f"Directly modifying the numerical resource identifier '{param}' yielded a successful response, potentially exposing unauthorized data.",
                                    severity="High",
                                    finding_type="idor",
                                    location=f"URL parameter: {param}",
                                    evidence=f"Access to ID {tid} was successful (HTTP 200) and structurally similar to primary ID.",
                                    remediation="Implement object-level access control checks. Use non-sequential UUIDs for resource identifiers.",
                                    cwe_refs=["CWE-639"]
                                ))
                                break
                except Exception:
                    pass
        return findings
