import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class CSRFModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "Cross-Site Request Forgery (CSRF)"

    @property
    def module_id(self) -> str:
        return "engine.modules.csrf"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            try:
                resp = await client.get(target_url)
                # Look for forms without anti-CSRF tokens
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(resp.text, 'html.parser')
                forms = soup.find_all('form')
                
                for i, form in enumerate(forms):
                    # Check for hidden fields that look like tokens
                    has_token = False
                    inputs = form.find_all('input', type='hidden')
                    token_names = ['csrf', 'token', 'xsrf', 'authenticity_token']
                    
                    for input_field in inputs:
                        name = input_field.get('name', '').lower()
                        if any(tn in name for tn in token_names):
                            has_token = True
                            break
                    
                    if not has_token and form.get('method', 'GET').upper() == 'POST':
                        findings.append(Finding(
                            id=f"csrf_form_{i}",
                            title="Missing Anti-CSRF Token",
                            description="A POST form was detected without an apparent anti-CSRF token. This may allow attackers to perform actions on behalf of authenticated users.",
                            severity="Medium",
                            finding_type="missing_csrf_token",
                            location=f"HTML form index {i} at {target_url}",
                            evidence=str(form)[:100] + "...",
                            remediation="Implement anti-CSRF tokens for all state-changing operations (POST, PUT, DELETE). Use the 'SameSite' cookie attribute.",
                            cwe_refs=["CWE-352"]
                        ))
            except Exception:
                pass
        return findings
