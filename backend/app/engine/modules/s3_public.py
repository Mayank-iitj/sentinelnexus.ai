import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class S3PublicModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "AWS S3 Public Bucket Detection"

    @property
    def module_id(self) -> str:
        return "engine.modules.s3_public"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        # Checks if the target_url (or substrings) points to common S3 patterns and if they are public
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                # 1. Check if the URL itself is an S3 bucket
                if "s3.amazonaws.com" in target_url or "s3-" in target_url:
                    resp = await client.get(target_url)
                    # "ListBucketResult" in XML response means it's public
                    if "<ListBucketResult" in resp.text:
                        findings.append(Finding(
                            id="s3_public_exposure",
                            title="Publicly Accessible S3 Bucket",
                            description="The target S3 bucket allows public listing of its contents, potentially exposing sensitive files.",
                            severity="Critical",
                            finding_type="s3_public_bucket",
                            location=target_url,
                            evidence="ListBucketResult XML signature found in root response.",
                            remediation="Disable 'Block Public Access' at the bucket and account level. Use IAM policies and bucket policies to restrict access.",
                            cwe_refs=["CWE-284"]
                        ))
                
                # 2. Brute-force common bucket names relative to target (if target is a name)
                # (Skipping for now to maintain scan speed, Fokus on URL-based detection)
            except Exception:
                pass
        return findings
