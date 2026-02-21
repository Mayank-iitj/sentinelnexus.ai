import asyncio
import importlib
import pkgutil
from typing import List, Dict, Any
from .modules.base_module import BaseScannerModule, Finding

class EngineOrchestrator:
    def __init__(self):
        self.modules: List[BaseScannerModule] = []
        self._load_modules()

    def _load_modules(self):
        """
        Dynamically loads all scanner modules from the engine.modules package.
        """
        import app.engine.modules as modules_pkg
        for loader, module_name, is_pkg in pkgutil.iter_modules(modules_pkg.__path__):
            if module_name == "base_module":
                continue
            
            full_module_name = f"app.engine.modules.{module_name}"
            module = importlib.import_module(full_module_name)
            
            for attr_name in dir(module):
                attr = getattr(module, attr_name)
                if (isinstance(attr, type) and 
                    issubclass(attr, BaseScannerModule) and 
                    attr is not BaseScannerModule):
                    self.modules.append(attr())

    async def run_full_scan(self, target_url: str, config: Dict[str, Any] = {}) -> List[Finding]:
        """
        Runs all loaded modules in parallel against the target.
        """
        tasks = [module.run(target_url, config) for module in self.modules]
        results = await asyncio.gather(*tasks)
        
        # Flatten findings
        all_findings = []
        for module_findings in results:
            all_findings.extend(module_findings)
            
        return all_findings

    def get_module_names(self) -> List[str]:
        return [m.name for m in self.modules]
