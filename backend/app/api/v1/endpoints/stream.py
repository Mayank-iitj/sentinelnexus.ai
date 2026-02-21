from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.unified_engine import CodeSecurityScanner
from app.services.scanners.prompt_scanner import PromptInjectionScanner
from app.db.database import SessionLocal
from app.models.scan import ScanResult
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
                async for event in PromptInjectionScanner.scan_stream(content):
                    await websocket.send_json(_to_serializable(event))

            elif scan_type == "monitor":
                # Real Global Threat Feed polling from Database
                import asyncio
                from datetime import timezone, timedelta
                from sqlalchemy import desc
                
                last_checked_id = None
                
                while True:
                    await asyncio.sleep(2.0) # Poll every 2 seconds
                    db = SessionLocal()
                    try:
                        query = db.query(ScanResult).order_by(desc(ScanResult.created_at))
                        
                        if last_checked_id:
                            # In a real system, we'd use a better cursor or timestamp
                            # but for this POC, we'll just check for newer IDs
                            recent_findings = query.limit(10).all()
                            # Find findings that we haven't sent yet
                            new_findings = []
                            for f in recent_findings:
                                if f.id == last_checked_id:
                                    break
                                new_findings.append(f)
                            
                            for f in reversed(new_findings):
                                event = {
                                    "timestamp": f.created_at.isoformat() if f.created_at else datetime.now(timezone.utc).isoformat(),
                                    "event_type": "activity",
                                    "severity": f.severity,
                                    "msg": f.finding_type.replace("_", " ").title(),
                                    "details": f.description[:200]
                                }
                                await websocket.send_json(event)
                                last_checked_id = f.id
                        else:
                            # Initialize with the latest ID so we only send new ones from now on
                            latest = query.first()
                            if latest:
                                last_checked_id = latest.id
                                # Send the very latest one as a starter
                                event = {
                                    "timestamp": latest.created_at.isoformat() if latest.created_at else datetime.now(timezone.utc).isoformat(),
                                    "event_type": "activity",
                                    "severity": latest.severity,
                                    "msg": latest.finding_type.replace("_", " ").title(),
                                    "details": latest.description[:200]
                                }
                                await websocket.send_json(event)
                    except Exception as e:
                        logger.error(f"Monitor feed error: {e}")
                    finally:
                        db.close()


    except WebSocketDisconnect:
        logger.info("WebSocket Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.close(code=1011)
        except:
            pass
