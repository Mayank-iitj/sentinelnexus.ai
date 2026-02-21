import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class NoSQLIModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "NoSQL Injection"

    @property
    def module_id(self) -> str:
        return "engine.modules.nosqli"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        # JSON-based and parameter-based NoSQL payloads
        payloads = [
            '{"$gt": ""}',
            '{"$ne": null}',
            "[$ne]=1",
            "[$gt]=",
        ]
        
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            params = config.get("params", ["user", "id", "search", "filter"])
            for param in params:
                for payload in payloads:
                    test_url = target_url
                    sep = "&" if "?" in test_url else "?"
                    test_url += f"{sep}{param}{payload}" # Notice the attachment style
                    
                    try:
                        resp = await client.get(test_url)
                        # Heuristic: if we get a significantly different number of results 
                        # or a database error from MongoDB/CouchDB
                        if any(x in resp.text.lower() for x in ["mongodb", "not authorized", "undefined", "bson"]):
                            findings.append(Finding(
                                id=f"nosqli_{param}_{hash(payload)}",
                                title="Potential NoSQL Injection",
                                description=f"The application appears vulnerable to NoSQL injection in the '{param}' parameter.",
                                severity="High",
                                finding_type="nosql_injection",
                                location=f"URL parameter: {param}",
                                evidence=f"Database-specific response or suspicious behavioral shift with payload: {payload}",
                                remediation="Use an ORM/ODM that handles sanitization, or manually validate all MongoDB/NoSQL operators. Avoid using raw object merges from user input.",
                                cwe_refs=["CWE-943"]
                            ))
                            break
                    except Exception:
                        pass
        return findings
