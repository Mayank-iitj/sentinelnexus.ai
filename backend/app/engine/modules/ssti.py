import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class SSTIModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "Server-Side Template Injection (SSTI)"

    @property
    def module_id(self) -> str:
        return "engine.modules.ssti"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        # Payloads for Jinja2, Mako, Twig, etc.
        payloads = [
            "{{7*7}}",      # Jinja/Twig
            "${7*7}",       # JSP/Spring
            "<%= 7*7 %>",   # ERB
            "#{7*7}",       # Pug/Jade
        ]
        
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            params = config.get("params", ["name", "title", "msg", "template"])
            for param in params:
                for payload in payloads:
                    test_url = target_url
                    sep = "&" if "?" in test_url else "?"
                    test_url += f"{sep}{param}={payload}"
                    
                    try:
                        resp = await client.get(test_url)
                        # If 49 appears in the response, the expression was evaluated
                        if "49" in resp.text:
                            findings.append(Finding(
                                id=f"ssti_{param}_{hash(payload)}",
                                title="Server-Side Template Injection Detected",
                                description=f"The application evaluates template expressions in the '{param}' parameter.",
                                severity="Critical",
                                finding_type="ssti",
                                location=f"URL parameter: {param}",
                                evidence=f"Mathematical expression {payload} evaluated to 49 in response.",
                                remediation="Do not pass user input directly into template engines. Use sandbox environments or predefined templates with placeholders.",
                                cwe_refs=["CWE-1336", "CWE-94"]
                            ))
                            break
                    except Exception:
                        pass
        return findings
