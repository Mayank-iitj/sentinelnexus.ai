import asyncio
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.getcwd(), "backend"))

from app.engine.orchestrator import EngineOrchestrator

async def run_test():
    print("🚀 Initializing SentinelNexus Engine Orchestrator...")
    orchestrator = EngineOrchestrator()
    
    print(f"📦 Loaded Modules: {', '.join(orchestrator.get_module_names())}")
    
    target = "http://example.com"
    print(f"🔍 Running test scan on {target}...")
    
    findings = await orchestrator.run_full_scan(target, {"params": ["q", "id", "search"]})
    
    print(f"\n✅ Scan complete. Found {len(findings)} findings.")
    for f in findings:
        print(f"  [{f.severity}] {f.title}: {f.description}")
        print(f"    - Type: {f.finding_type}")
        print(f"    - Evidence: {f.evidence}")
    
    if not findings:
        print("  (No vulnerabilities detected on clean target - OK)")

if __name__ == "__main__":
    asyncio.run(run_test())
