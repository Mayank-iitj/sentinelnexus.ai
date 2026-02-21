import socket
import ssl
from typing import List, Dict, Any
from urllib.parse import urlparse
from .base_module import BaseScannerModule, Finding

class SSLScannerModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "SSL/TLS Configuration Security"

    @property
    def module_id(self) -> str:
        return "engine.modules.ssl_scanner"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        parsed = urlparse(target_url)
        hostname = parsed.hostname
        port = parsed.port or (443 if parsed.scheme == 'https' else 80)
        
        if parsed.scheme != 'https':
            findings.append(Finding(
                id="no_https",
                title="Insecure HTTP Protocol",
                description="The target application is accessible over unencrypted HTTP.",
                severity="High",
                finding_type="missing_tls",
                location=target_url,
                evidence="Protocol scheme is 'http'.",
                remediation="Implement TLS/SSL (HTTPS) and enforce HSTS (HTTP Strict Transport Security).",
                cwe_refs=["CWE-319"]
            ))
            return findings

        # Perform basic SSL check
        context = ssl.create_default_context()
        try:
            with socket.create_connection((hostname, port), timeout=5) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    # Check for weak protocols if possible (Python's ssl module is limited but we can check the version used)
                    version = ssock.version()
                    if version in ["TLSv1", "TLSv1.1"]:
                        findings.append(Finding(
                            id="weak_tls_version",
                            title="Weak TLS Version Supported",
                            description=f"The server supports an outdated and insecure TLS version: {version}.",
                            severity="Medium",
                            finding_type="weak_ssl_config",
                            location=f"{hostname}:{port}",
                            evidence=f"Negotiated TLS version: {version}",
                            remediation="Disable support for TLS 1.0 and 1.1. Enforce TLS 1.2 or 1.3 as the minimum protocol version.",
                            cwe_refs=["CWE-327"]
                        ))
        except Exception as e:
            # Connection or handshake failed
            pass
            
        return findings
