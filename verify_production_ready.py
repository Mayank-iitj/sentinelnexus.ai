#!/usr/bin/env python
"""
Production readiness verification script.
Checks all components before deployment.
"""

import sys
import subprocess
from pathlib import Path


def run_command(cmd, description):
    """Run a command and report results."""
    print(f"\n🔍 {description}...", end=" ")
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, shell=True)
        if result.returncode == 0:
            print("✅")
            return True
        else:
            print(f"❌ - {result.stderr[:100]}")
            return False
    except Exception as e:
        print(f"❌ - {str(e)}")
        return False


def check_environment():
    """Check environment setup."""
    print("\n" + "="*60)
    print("PRODUCTION READINESS CHECK")
    print("="*60)
    
    checks = [
        ("python --version", "Python installed"),
        ("docker --version", "Docker installed"),
        ("docker-compose --version", "Docker Compose installed"),
        ("git --version", "Git installed"),
    ]
    
    results = []
    for cmd, desc in checks:
        results.append(run_command(cmd, desc))
    
    return all(results)


def check_backend():
    """Check backend setup."""
    print("\n" + "-"*60)
    print("Backend Checks")
    print("-"*60)
    
    backend_path = Path("backend")
    
    checks = []
    
    # Check requirements file
    if (backend_path / "requirements.txt").exists():
        print("✅ requirements.txt found")
        checks.append(True)
    else:
        print("❌ requirements.txt missing")
        checks.append(False)
    
    # Check main app file
    if (backend_path / "app" / "main.py").exists():
        print("✅ app/main.py found")
        checks.append(True)
    else:
        print("❌ app/main.py missing")
        checks.append(False)
    
    # Check migrations
    if (backend_path / "alembic" / "versions").exists():
        migrations = list((backend_path / "alembic" / "versions").glob("*.py"))
        print(f"✅ Database migrations found ({len(migrations)})")
        checks.append(True)
    else:
        print("❌ Database migrations missing")
        checks.append(False)
    
    # Check tests
    if (backend_path / "tests").exists():
        test_files = list((backend_path / "tests").glob("test_*.py"))
        print(f"✅ Tests found ({len(test_files)})")
        checks.append(True)
    else:
        print("❌ Tests missing")
        checks.append(False)
    
    return all(checks)


def check_frontend():
    """Check frontend setup."""
    print("\n" + "-"*60)
    print("Frontend Checks")
    print("-"*60)
    
    frontend_path = Path("frontend")
    
    checks = []
    
    # Check package.json
    if (frontend_path / "package.json").exists():
        print("✅ package.json found")
        checks.append(True)
    else:
        print("❌ package.json missing")
        checks.append(False)
    
    # Check app directory
    if (frontend_path / "src" / "app").exists():
        print("✅ src/app directory found")
        checks.append(True)
    else:
        print("❌ src/app directory missing")
        checks.append(False)
    
    # Check components
    if (frontend_path / "src" / "components").exists():
        components = list((frontend_path / "src" / "components").glob("*.tsx"))
        print(f"✅ Components found ({len(components)})")
        checks.append(True)
    else:
        print("❌ Components missing")
        checks.append(False)
    
    return all(checks)


def check_deploy():
    """Check deployment setup."""
    print("\n" + "-"*60)
    print("Deployment Checks")
    print("-"*60)
    
    checks = []
    
    # Check Docker Compose
    if Path("docker-compose.yml").exists():
        print("✅ docker-compose.yml found")
        checks.append(True)
    else:
        print("❌ docker-compose.yml missing")
        checks.append(False)
    
    # Check env template
    if Path(".env.example").exists():
        print("✅ .env.example found")
        checks.append(True)
    else:
        print("❌ .env.example missing")
        checks.append(False)
    
    # Check Dockerfiles
    dockerfiles = list(Path("docker").glob("Dockerfile.*"))
    if dockerfiles:
        print(f"✅ Dockerfiles found ({len(dockerfiles)})")
        checks.append(True)
    else:
        print("❌ Dockerfiles missing")
        checks.append(False)
    
    # Check CI/CD
    if Path(".github/workflows/ci-cd.yml").exists():
        print("✅ CI/CD pipeline found")
        checks.append(True)
    else:
        print("❌ CI/CD pipeline missing")
        checks.append(False)
    
    return all(checks)


def check_documentation():
    """Check documentation."""
    print("\n" + "-"*60)
    print("Documentation Checks")
    print("-"*60)
    
    checks = []
    docs = [
        ("README.md", "README"),
        ("DEPLOYMENT.md", "Deployment Guide"),
        ("ARCHITECTURE.md", "Architecture Guide"),
    ]
    
    for filename, description in docs:
        if Path(filename).exists():
            print(f"✅ {description} found")
            checks.append(True)
        else:
            print(f"❌ {description} missing")
            checks.append(False)
    
    return all(checks)


def main():
    """Run all checks."""
    try:
        results = {
            'environment': check_environment(),
            'backend': check_backend(),
            'frontend': check_frontend(),
            'deployment': check_deploy(),
            'documentation': check_documentation(),
        }
        
        print("\n" + "="*60)
        print("SUMMARY")
        print("="*60)
        
        for check, passed in results.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"{check.capitalize():20} {status}")
        
        all_passed = all(results.values())
        
        print("\n" + "="*60)
        if all_passed:
            print("✨ All checks passed!")
            print("✨ System is ready for deployment!")
            print("="*60)
            return 0
        else:
            print("⚠️  Some checks failed!")
            print("⚠️  Please address the issues above before deploying")
            print("="*60)
            return 1
    
    except Exception as e:
        print(f"\n❌ Error during checks: {str(e)}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
