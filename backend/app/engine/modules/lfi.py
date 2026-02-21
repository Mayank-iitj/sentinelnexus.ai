import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class LFIModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "Local File Inclusion (LFI) / Path Traversal"

    @property
    def module_id(self) -> str:
        return "engine.modules.lfi"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        # Common LFI payloads
        payloads = [
            "/etc/passwd",
            "../../../../etc/passwd",
            "..\\..\\..\\..\\windows\\win.ini",
            "C:\\windows\\win.ini",
        ]
        
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            params = config.get("params", ["file", "path", "page", "include", "view"])
            for param in params:
                for payload in payloads:
                    test_url = target_url
                    sep = "&" if "?" in test_url else "?"
                    test_url += f"{sep}{param}={payload}"
                    
                    try:
                        resp = await client.get(test_url)
                        if any(x in resp.text for x in ["root:x:0:0", "[extensions]", "[fonts]", "bit 16"]):
                            findings.append(Finding(
                                id=f"lfi_{param}_{hash(payload)}",
                                title="LFI / Path Traversal Detected",
                                description=f"The application appears to allow arbitrary file reading through the '{param}' parameter.",
                                severity="High",
                                finding_type="local_file_inclusion",
                                location=f"URL parameter: {param}",
                                evidence=f"Sensitive file content detected in response for payload: {payload}",
                                remediation="Never use user-provided paths directly in file system operations. Use a predefined map of allowed files or store files in a database.",
                                cwe_refs=["CWE-22", "CWE-98"]
                            ))
                            break
                    except Exception:
                        pass
        return findings
