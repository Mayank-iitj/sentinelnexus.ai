import httpx
from typing import List, Dict, Any
from .base_module import BaseScannerModule, Finding

class GraphQLScanModule(BaseScannerModule):
    @property
    def name(self) -> str:
        return "GraphQL Security Testing"

    @property
    def module_id(self) -> str:
        return "engine.modules.graphql"

    async def run(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        findings = []
        # 1. Introspection Query
        introspection_query = '{"query": "{__schema{queryType{name}}}"}'
        
        # 2. Batching Check
        batch_payload = '[{"query":"query{__typename}"}, {"query":"query{__typename}"}]'
        
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                # Check for introspection
                resp = await client.post(target_url, content=introspection_query, headers={"Content-Type": "application/json"})
                if "queryType" in resp.text:
                    findings.append(Finding(
                        id="graphql_introspection",
                        title="GraphQL Introspection Enabled",
                        description="The GraphQL API permits schema introspection, which reveals all available queries, mutations, and types to anyone.",
                        severity="Low",
                        finding_type="information_disclosure",
                        location=target_url,
                        evidence="Introspection query returned schema metadata.",
                        remediation="Disable introspection in production environments.",
                        cwe_refs=["CWE-200"]
                    ))

                # Check for batching
                resp = await client.post(target_url, content=batch_payload, headers={"Content-Type": "application/json"})
                if isinstance(resp.json(), list) and len(resp.json()) == 2:
                    findings.append(Finding(
                        id="graphql_batching",
                        title="GraphQL Query Batching Enabled",
                        description="The API allows batching multiple queries in a single request, which can be used for DoS or brute-force attacks.",
                        severity="Medium",
                        finding_type="resource_exhaustion",
                        location=target_url,
                        evidence="Request with 2 batched queries yielded 2 results.",
                        remediation="Limit the number of batched operations allowed in a single request or disable batching if not required.",
                        cwe_refs=["CWE-770"]
                    ))
            except Exception:
                pass
        return findings
