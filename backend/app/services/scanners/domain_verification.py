import httpx
import dns.resolver
from typing import Optional

class DomainVerificationService:
    @staticmethod
    async def verify_via_dns(domain: str, expected_token: str) -> bool:
        """Verify domain ownership via TXT record mapping"""
        try:
            # Check for TXT record: sentinelnexus-site-verification=<token>
            records = dns.resolver.resolve(f"_sentinelnexus.{domain}", "TXT")
            for rdata in records:
                for string in rdata.strings:
                    if f"sentinelnexus-site-verification={expected_token}" in string.decode():
                        return True
        except Exception:
            pass
        return False

    @staticmethod
    async def verify_via_file(domain: str, expected_token: str) -> bool:
        """Verify domain ownership via file upload check"""
        url = f"http://{domain}/.well-known/sentinelnexus-verification.txt"
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                resp = await client.get(url)
                if resp.status_code == 200 and expected_token in resp.text:
                    return True
            except Exception:
                pass
        return False
