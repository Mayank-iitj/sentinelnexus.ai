"""
Quick setup script - Initialize AI Shield for development.
Run: python setup.py
"""

import os
import sys
import subprocess
from pathlib import Path


def run_command(command, description):
    """Run command and report status."""
    print(f"\n📦 {description}...", end=" ", flush=True)
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print("✅")
            return True
        else:
            print(f"❌")
            print(f"  Error: {result.stderr[:200]}")
            return False
    except Exception as e:
        print(f"❌ - {str(e)}")
        return False


def main():
    """Setup AI Shield development environment."""
    print("\n" + "="*60)
    print("🚀 AI SHIELD - DEVELOPMENT SETUP")
    print("="*60)
    
    # Check Python version
    if sys.version_info < (3, 9):
        print("❌ Python 3.9+ required")
        sys.exit(1)
    
    print(f"✓ Python {sys.version.split()[0]}")
    
    # Create .env if not exists
    if not Path(".env").exists():
        print("\n📝 Creating .env file...")
        if Path(".env.example").exists():
            import shutil
            shutil.copy(".env.example", ".env")
            print("✓ .env created from .env.example")
            print("⚠️  Please update .env with your configuration")
        else:
            print("❌ .env.example not found")
    else:
        print("✓ .env already exists")
    
    # Backend setup
    print("\n" + "-"*60)
    print("Backend Setup")
    print("-"*60)
    
    backend_path = Path("backend")
    if backend_path.exists():
        os.chdir(backend_path)
        
        # Install dependencies
        run_command(
            "pip install -r requirements.txt",
            "Installing backend dependencies"
        )
        
        run_command(
            "pip install -r requirements-dev.txt",
            "Installing development dependencies"
        )
        
        os.chdir("..")
    
    # Frontend setup
    print("\n" + "-"*60)
    print("Frontend Setup")
    print("-"*60)
    
    frontend_path = Path("frontend")
    if frontend_path.exists():
        os.chdir(frontend_path)
        
        run_command(
            "npm install",
            "Installing frontend dependencies"
        )
        
        os.chdir("..")
    
    # Create directories
    print("\n" + "-"*60)
    print("Directory Setup")
    print("-"*60)
    
    dirs = [
        "backend/logs",
        "backend/data",
        "frontend/.next",
        "uploads",
        "backups",
    ]
    
    for dir_path in dirs:
        Path(dir_path).mkdir(parents=True, exist_ok=True)
        print(f"✓ {dir_path}")
    
    # Summary
    print("\n" + "="*60)
    print("✨ SETUP COMPLETE!")
    print("="*60)
    print("\nNext steps:")
    print("1. Update .env with your configuration")
    print("2. Run: docker-compose up")
    print("3. Or run backend: python backend/run.py")
    print("4. Or run frontend: cd frontend && npm run dev")
    print("\nDocumentation:")
    print("- README.md - Project overview")
    print("- DEPLOYMENT.md - Deployment guide")
    print("- API_REFERENCE.md - API documentation")
    print("\n" + "="*60)


if __name__ == "__main__":
    main()
