import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class MassAssignmentModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "API Mass Assignment Detection"

    @property
    def module_id(self) -> str:
        return "engine.modules.mass_assignment"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        # Payload with suspicious "admin" or "role" fields
        payload = {"role": "admin", "is_admin": True, "admin": 1, "status": "active"}
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                # Test POST/PATCH/PUT for mass assignment
                for method in ["POST", "PATCH", "PUT"]:
                    resp = await client.request(method, target_url, json=payload)
                    # If server accepts these fields with 200/201/204
                    if resp.status_code in [200, 201, 204]:
                        findings.append(Finding(
                            id=f"mass_assignment_{method.lower()}",
                            title=f"Potential Mass Assignment ({method})",
                            description=f"The API endpoint appears to accept administrative fields like 'role' or 'is_admin' without strict validation.",
                            severity="High",
                            finding_type="mass_assignment",
                            location=f"{method} {target_url}",
                            evidence=f"Success status {resp.status_code} when sending sensitive fields in JSON payload.",
                            remediation="Implement strict DTOs (Data Transfer Objects) and only permit allowed fields in requested models.",
                            cwe_refs=["CWE-915"]
                        ))
                        break
            except Exception:
                pass
        return findings
