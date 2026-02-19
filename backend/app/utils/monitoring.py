"""
Monitoring and metrics utilities for production.
"""

import time
from functools import wraps
from typing import Callable
import logging

logger = logging.getLogger(__name__)


class PerformanceMonitor:
    """Monitor API endpoint performance."""
    
    def __init__(self):
        self.metrics = {}
    
    def record_metric(self, endpoint: str, duration: float, status_code: int):
        """Record performance metric."""
        if endpoint not in self.metrics:
            self.metrics[endpoint] = {
                'count': 0,
                'total_time': 0,
                'avg_time': 0,
                'min_time': float('inf'),
                'max_time': 0,
                'errors': 0
            }
        
        m = self.metrics[endpoint]
        m['count'] += 1
        m['total_time'] += duration
        m['avg_time'] = m['total_time'] / m['count']
        m['min_time'] = min(m['min_time'], duration)
        m['max_time'] = max(m['max_time'], duration)
        
        if status_code >= 400:
            m['errors'] += 1
    
    def get_metrics(self, endpoint: str = None):
        """Get metrics for endpoint or all endpoints."""
        if endpoint:
            return self.metrics.get(endpoint, {})
        return self.metrics
    
    def report(self):
        """Generate performance report."""
        report = "\n" + "="*60 + "\n"
        report += "PERFORMANCE METRICS\n"
        report += "="*60 + "\n"
        
        for endpoint, metrics in self.metrics.items():
            report += f"\n{endpoint}:\n"
            report += f"  Requests: {metrics['count']}\n"
            report += f"  Avg Time: {metrics['avg_time']:.2f}ms\n"
            report += f"  Min Time: {metrics['min_time']:.2f}ms\n"
            report += f"  Max Time: {metrics['max_time']:.2f}ms\n"
            report += f"  Errors: {metrics['errors']}\n"
        
        report += "\n" + "="*60
        return report


def monitor_performance(endpoint: str):
    """Decorator to monitor endpoint performance."""
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start = time.time()
            try:
                result = func(*args, **kwargs)
                return result
            finally:
                duration = (time.time() - start) * 1000  # ms
                logger.debug(f"{endpoint} took {duration:.2f}ms")
        return wrapper
    return decorator


class HealthCheck:
    """Health check utilities."""
    
    @staticmethod
    def is_healthy(db_session, redis_client) -> dict:
        """Check system health."""
        health = {
            'status': 'healthy',
            'timestamp': time.time(),
            'components': {}
        }
        
        # Check database
        try:
            from sqlalchemy import text
            db_session.execute(text("SELECT 1"))
            health['components']['database'] = 'healthy'
        except Exception as e:
            health['components']['database'] = f'unhealthy: {str(e)}'
            health['status'] = 'degraded'
        
        # Check Redis
        try:
            redis_client.ping()
            health['components']['cache'] = 'healthy'
        except Exception as e:
            health['components']['cache'] = f'unhealthy: {str(e)}'
            health['status'] = 'degraded'
        
        return health
