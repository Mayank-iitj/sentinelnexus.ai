from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.unified_engine import CodeSecurityScanner
import json
import logging
from dataclasses import asdict, is_dataclass
from enum import Enum
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

def _to_serializable(obj):
    if is_dataclass(obj):
        return {k: _to_serializable(v) for k, v in asdict(obj).items()}
    if isinstance(obj, Enum):
        return obj.value
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, list):
        return [_to_serializable(i) for i in obj]
    if isinstance(obj, dict):
        return {k: _to_serializable(v) for k, v in obj.items()}
    return obj

@router.websocket("/ws/scan")
async def websocket_scan(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
            except json.JSONDecodeError:
                continue

            scan_type = payload.get("type", "code")
            content = payload.get("content", "")
            
            if not content:
                continue

            if scan_type == "code":
                async for event in CodeSecurityScanner.scan_stream(content):
                    await websocket.send_json(_to_serializable(event))
            
            # Placeholder for other types
            elif scan_type == "prompt":
                # Implement PromptScanner.scan_stream later if needed
                pass

            elif scan_type == "monitor":
                # Simulated Global Threat Feed for Dashboard "Wow" Factor
                import random
                import asyncio
                
                threats = [
                    ("SQL Injection Attempt", "critical", "db.execute(user_input)"),
                    ("XSS Payload", "high", "<script>alert(1)</script>"),
                    ("AWS Key Leak", "critical", "AKIA... detected in logs"),
                    ("Sensitive Data Exposure", "medium", "Email address found in public scope"),
                    ("Debug Mode Enabled", "low", "Flask debug=True"),
                    ("Hardcoded Secret", "high", "password='admin'"),
                    ("Insecure Design", "medium", "Missing rate limiting"),
                    ("Open Redirect", "medium", "redirect(url)"),
                ]
                
                while True:
                    await asyncio.sleep(random.uniform(2.0, 5.0))
                    name, sev, desc = random.choice(threats)
                    
                    event = {
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "event_type": "activity",
                        "severity": sev,
                        "msg": name,
                        "details": desc
                    }
                    await websocket.send_json(event)


    except WebSocketDisconnect:
        logger.info("WebSocket Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.close(code=1011)
        except:
            pass
