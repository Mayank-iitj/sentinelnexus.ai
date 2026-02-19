# AI Shield - Contribution Guidelines

Thank you for interest in contributing to AI Shield!

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork>`
3. Create feature branch: `git checkout -b feature/my-feature`
4. Run setup: `python setup.py`
5. Make changes
6. Run tests: `pytest backend/tests/`
7. Commit: `git commit -am "Add feature"`
8. Push: `git push origin feature/my-feature`
9. Create Pull Request

## Development Setup

```bash
# Install dependencies
python setup.py

# Run backend
cd backend && python run.py

# Run frontend (in another terminal)
cd frontend && npm run dev

# Run tests
pytest backend/tests/

# Run with Docker
docker-compose up
```

## Code Standards

- **Python**: PEP 8, type hints required
- **TypeScript/React**: ESLint, Prettier
- **Commit messages**: Clear, descriptive (50 chars)
- **Tests**: 70%+ coverage required

## Testing

All PRs must include tests:

```bash
# Backend tests
cd backend
pytest tests/ -v --cov=app

# Frontend tests
cd frontend
npm test
```

## Documentation

Update docs for new features:
- README.md - Overview changes
- API_REFERENCE.md - API endpoint changes
- DEPLOYMENT.md - Deployment changes
- Code comments - Complex logic

## Pull Request Process

1. Update CHANGELOG.md
2. Add tests for changes
3. Update documentation
4. Request review from maintainers
5. Address feedback
6. Squash commits if requested
7. Merge when approved

## Reporting Issues

Include:
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, Python, Node version)
- Screenshots/logs if applicable

## Feature Requests

Describe:
- Use case
- Expected behavior
- Proposed implementation (optional)
- Priority level

## Areas for Contribution

- Bug fixes
- Performance optimization
- New scanners (bias, hallucination, etc.)
- Documentation improvements
- Test coverage expansion
- UI/UX improvements
- Deployment options (K8s, etc.)

## Questions?

- Email: dev@aishield.io
- Discussions: GitHub Discussions
- Issues: GitHub Issues

Thank you for contributing! 🎉
