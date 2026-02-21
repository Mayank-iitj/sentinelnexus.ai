import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class SQLIModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "SQL Injection"

    @property
    def module_id(self) -> str:
        return "engine.modules.sqli"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        # Error-based payloads
        payloads = [
            "'",
            "''",
            "\"",
            "admin'--",
            "1' OR '1'='1",
        ]
        
        # Common error signatures
        error_signatures = [
            "SQL syntax",
            "mysql_fetch",
            "PostgreSQL",
            "SQLite/JDBCDriver",
            "Microsoft OLE DB Provider for SQL Server",
            "ORA-00933",
        ]
        
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            params = config.get("params", ["id", "user", "cat", "page"])
            for param in params:
                for payload in payloads:
                    test_url = target_url
                    sep = "&" if "?" in test_url else "?"
                    test_url += f"{sep}{param}={payload}"
                    
                    try:
                        resp = await client.get(test_url)
                        if any(sig.lower() in resp.text.lower() for sig in error_signatures):
                            findings.append(Finding(
                                id=f"sqli_{param}_{hash(payload)}",
                                title="Error-based SQL Injection suspected",
                                description=f"A database error signature was detected in the response when injecting the '{param}' parameter.",
                                severity="Critical",
                                finding_type="sql_injection",
                                location=f"URL parameter: {param}",
                                evidence=f"Payload: {payload} triggered an apparent SQL error in response.",
                                remediation="Use parameterized queries (prepared statements) for all database interactions. Implement input validation and limit database user permissions.",
                                cwe_refs=["CWE-89"]
                            ))
                            break
                    except Exception:
                        pass
        return findings
