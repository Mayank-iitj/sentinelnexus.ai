import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class RCEModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "Remote Code Execution (RCE)"

    @property
    def module_id(self) -> str:
        return "engine.modules.rce"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        # Commands to execute (neutral commands that show output)
        payloads = [
            "$(whoami)",
            "`id`",
            "; cat /etc/passwd",
            "| ping -c 1 127.0.0.1",
            "& ipconfig /all",
        ]
        
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            params = config.get("params", ["cmd", "exec", "shell", "run", "query"])
            for param in params:
                for payload in payloads:
                    test_url = target_url
                    sep = "&" if "?" in test_url else "?"
                    test_url += f"{sep}{param}={payload}"
                    
                    try:
                        resp = await client.get(test_url)
                        # Heuristics for successful RCE
                        # Note: In a real system, we might use a callback service (OOB)
                        if any(x in resp.text for x in ["root:x:0:0", "uid=", "Windows IP Configuration"]):
                            findings.append(Finding(
                                id=f"rce_{param}_{hash(payload)}",
                                title="Command Injection / RCE Detected",
                                description=f"The application appears to execute shell commands provided in the '{param}' parameter.",
                                severity="Critical",
                                finding_type="remote_code_execution",
                                location=f"URL parameter: {param}",
                                evidence=f"Command output detected in response for payload: {payload}",
                                remediation="Avoid executing system commands based on user input. Use language-specific APIs instead. If unavoidable, use strict allowlists and escape all inputs.",
                                cwe_refs=["CWE-78", "CWE-94"]
                            ))
                            break
                    except Exception:
                        pass
        return findings
