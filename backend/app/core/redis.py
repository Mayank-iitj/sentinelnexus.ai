import redis
from app.core.config import get_settings

settings = get_settings()

class RedisClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RedisClient, cls).__new__(cls)
            cls._instance.client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        return cls._instance

    @property
    def r(self):
        return self.client

def get_redis():
    return RedisClient().r
