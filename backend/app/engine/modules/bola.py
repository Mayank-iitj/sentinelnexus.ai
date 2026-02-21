import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class BOLAModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "Broken Object Level Authorization (BOLA)"

    @property
    def module_id(self) -> str:
        return "engine.modules.bola"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        # Enhanced IDOR/BOLA check focusing on API patterns (e.g., /api/v1/users/123)
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=False) as client:
            try:
                import re
                # Match common API ID patterns: /id, /users/id, /v1/item/id
                id_pattern = r'/(?:[a-zA-Z0-9_-]+/)?(\d+|[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12})'
                matches = re.findall(id_pattern, target_url)
                
                if matches:
                    original_id = matches[-1]
                    # Test payloads: increment/decrement or random UUID
                    test_ids = []
                    if original_id.isdigit():
                        oid_int = int(original_id)
                        test_ids = [str(oid_int - 1), str(oid_int + 1), "1", "0"]
                    else:
                        # UUID-like, try some common "insecure" IDs or null
                        test_ids = ["00000000-0000-0000-0000-000000000000", "11111111-1111-1111-1111-111111111111"]

                    original_resp = await client.get(target_url)
                    
                    for tid in test_ids:
                        if tid == original_id: continue
                        test_url = target_url.replace(original_id, tid)
                        resp = await client.get(test_url)
                        
                        # If we get a 200 OK for a different ID and the structure is similar
                        if resp.status_code == 200 and abs(len(resp.text) - len(original_resp.text)) < 500:
                            findings.append(Finding(
                                id=f"bola_{hash(test_url)}",
                                title="BOLA / Broken Object Level Authorization",
                                description=f"The API endpoint appears to allow unauthorized access to resource ID '{tid}' which differs from the requested object.",
                                severity="High",
                                finding_type="bola",
                                location=f"API Path: {test_url}",
                                evidence=f"Successful HTTP 200 response when accessing sibling resource ID '{tid}'.",
                                remediation="Check user authorization for every object requested. Use a gateway or middleware to enforce object-level permissions.",
                                cwe_refs=["CWE-639", "CWE-285"],
                                metadata={"original_id": original_id, "test_id": tid}
                            ))
                            break
            except Exception:
                pass
        return findings
