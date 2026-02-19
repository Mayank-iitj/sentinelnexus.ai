"""
Makefile for common development and deployment tasks.
"""

.PHONY: help install install-dev run test lint format clean docker-build docker-up docker-down migrate seed

help:
	@echo "AI Shield - Available Commands"
	@echo "=============================="
	@echo "make install          - Install production dependencies"
	@echo "make install-dev      - Install development dependencies"
	@echo "make run              - Run the FastAPI server"
	@echo "make test             - Run all tests"
	@echo "make test-coverage    - Run tests with coverage report"
	@echo "make lint             - Run linting checks"
	@echo "make format           - Format code with black and isort"
	@echo "make clean            - Clean temporary files"
	@echo "make docker-build     - Build Docker images"
	@echo "make docker-up        - Start Docker services"
	@echo "make docker-down      - Stop Docker services"
	@echo "make migrate          - Run database migrations"
	@echo "make seed             - Seed initial data"
	@echo "make worker           - Run Celery worker"
	@echo "make beat             - Run Celery Beat scheduler"
	@echo "make docs             - Generate API documentation"

install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

install-dev:
	cd backend && pip install -r requirements.txt -r requirements-dev.txt
	cd frontend && npm install

run:
	cd backend && python run.py

worker:
	cd backend && celery -A app.tasks worker --loglevel=info

beat:
	cd backend && celery -A app.tasks beat --loglevel=info

test:
	cd backend && pytest tests/ -v

test-coverage:
	cd backend && pytest tests/ --cov=app --cov-report=html --cov-report=term

lint:
	cd backend && flake8 app --max-line-length=100
	cd backend && mypy app

format:
	cd backend && black app tests
	cd backend && isort app tests

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name .pytest_cache -exec rm -rf {} +
	find . -type d -name htmlcov -exec rm -rf {} +
	find . -name .coverage -delete
	cd frontend && rm -rf .next out

docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

migrate:
	docker-compose exec -T backend alembic upgrade head

migrate-create:
	docker-compose exec backend alembic revision --autogenerate -m "$(message)"

seed:
	docker-compose exec -T backend python -m app.db.init_db

shell:
	docker-compose exec backend python

frontend-dev:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

frontend-start:
	cd frontend && npm start

health-check:
	@echo "Checking API health..."
	@curl -s http://localhost:8000/health | jq .
	@echo "Checking Frontend..."
	@curl -s http://localhost:3000 > /dev/null && echo "✓ Frontend OK" || echo "✗ Frontend Down"

requirements:
	cd backend && pip freeze > requirements.txt

docs:
	@echo "API Docs available at http://localhost:8000/docs"
	@echo "ReDoc available at http://localhost:8000/redoc"
