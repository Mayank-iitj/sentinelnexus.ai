#!/usr/bin/env python
"""Entrypoint for running the FastAPI application."""

import uvicorn
from app.main import app
from app.core.config import get_settings

if __name__ == "__main__":
    settings = get_settings()
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info",
    )
