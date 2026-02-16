#!/usr/bin/env python3
"""
AWS App Runner Deployment Helper
This script helps automate or assist with deploying the Invoice Fraud App to AWS App Runner
"""

import subprocess
import json
import sys

class AppRunnerDeploymentHelper:
    def __init__(self):
        self.service_name = "invoice-fraud-app"
        self.github_repo = "Zohairmohd02/invoice-fraud-app"
        self.github_branch = "main"
        self.aws_region = "us-east-1"
        self.port = 3000

    def check_prerequisites(self):
        """Check if AWS CLI is installed and configured"""
        print("[1/3] Checking prerequisites...\n")
        
        try:
            result = subprocess.run(['aws', '--version'], capture_output=True, text=True)
            print(f"✓ AWS CLI: {result.stdout.strip()}")
        except FileNotFoundError:
            print("✗ AWS CLI not found. Please install it from: https://aws.amazon.com/cli/")
            return False
        
        try:
            result = subprocess.run(['aws', 'sts', 'get-caller-identity'], capture_output=True, text=True)
            identity = json.loads(result.stdout)
            print(f"✓ AWS Account: {identity['Account']}")
        except Exception as e:
            print(f"✗ AWS credentials not configured. Error: {e}")
            return False
        
        print("\n")
        return True

    def display_setup_guide(self):
        """Display step-by-step setup guide"""
        print("[2/3] AWS App Runner Setup Guide\n")
        print("=" * 60)
        print("FOLLOW THESE STEPS IN AWS CONSOLE:")
        print("=" * 60)
        print()
        print("1. OPEN AWS CONSOLE")
        print("   • Go to: https://console.aws.amazon.com/")
        print("   • Region: us-east-1 (N. Virginia)")
        print()
        print("2. NAVIGATE TO APP RUNNER")
        print("   • Search: 'App Runner'")
        print("   • Click: AWS App Runner")
        print()
        print("3. CREATE NEW SERVICE")
        print("   • Click: 'Create service'")
        print()
        print("4. SELECT SOURCE")
        print("   • Source type: Source repository")
        print("   • Provider: GitHub")
        print("   • Click: 'Connect GitHub'")
        print("   • Authorize AWS access to GitHub")
        print("   • Select repository: Zohairmohd02/invoice-fraud-app")
        print("   • Select branch: main")
        print("   • Click: Next")
        print()
        print("5. BUILD SETTINGS")
        print("   • Build method: Dockerfile")
        print("   • Dockerfile path: Dockerfile")
        print("   • Build context: . (root)")
        print("   • Click: Next")
        print()
        print("6. SERVICE SETTINGS")
        print("   • Service name: invoice-fraud-app")
        print("   • Port: 3000")
        print("   • Environment variables: (optional)")
        print("     - NODE_ENV: production")
        print("     - PORT: 3000")
        print()
        print("7. RESOURCE CONFIGURATION (FREE TIER)")
        print("   • CPU: 0.25 vCPU")
        print("   • Memory: 512 MB")
        print("   • Min instances: 1")
        print("   • Max instances: 2")
        print()
        print("8. HEALTH CHECK")
        print("   • Health check path: /api/health")
        print("   • Interval: 5 seconds")
        print("   • Timeout: 2 seconds")
        print()
        print("9. AUTO DEPLOYMENTS")
        print("   • Enable auto-deployment from main branch")
        print()
        print("10. DEPLOY")
        print("    • Click: 'Create & deploy'")
        print("    • Wait 3-5 minutes for deployment")
        print()
        print("11. GET YOUR URL")
        print("    • Look for 'Service URL' in service details")
        print("    • Format: https://[name].us-east-1.apprunner.amazonaws.com")
        print()
        print("=" * 60)
        print()

    def display_testing_guide(self):
        """Display testing guide"""
        print("[3/3] Testing Your Deployment\n")
        print("=" * 60)
        print("AFTER DEPLOYMENT IS COMPLETE:")
        print("=" * 60)
        print()
        print("1. TEST FRONTEND")
        print("   • Open in browser: https://[app-url].apprunner.amazonaws.com")
        print("   • You should see your React Invoice Fraud app")
        print()
        print("2. TEST API")
        print("   • Health check: https://[app-url]/api/health")
        print("   • Should return: {\"status\":\"ok\"}")
        print()
        print("3. MONITOR LOGS")
        print("   • Go to App Runner service in AWS Console")
        print("   • Click: Logs tab")
        print("   • Check application logs")
        print()
        print("4. AUTO DEPLOYMENTS")
        print("   • Push to GitHub main branch")
        print("   • App Runner automatically deploys")
        print("   • Check Deployments tab to monitor")
        print()
        print("=" * 60)
        print()

    def display_cost_info(self):
        """Display free tier cost information"""
        print("FREE TIER INFORMATION:")
        print("=" * 60)
        print("✓ 1 always-on service with 0.25 vCPU + 512 MB: FREE")
        print("✓ 1 GB outbound data transfer per month: FREE")
        print("✓ Additional services/resources may incur charges")
        print()
        print("Learn more: https://aws.amazon.com/apprunner/pricing/")
        print("=" * 60)
        print()

    def run(self):
        """Run the complete deployment helper"""
        print("\n")
        print("╔════════════════════════════════════════╗")
        print("║  AWS App Runner Deployment Helper      ║")
        print("║  Invoice Fraud Detection App           ║")
        print("╚════════════════════════════════════════╝")
        print()

        if not self.check_prerequisites():
            sys.exit(1)

        self.display_setup_guide()
        self.display_testing_guide()
        self.display_cost_info()

        print("READY FOR DEPLOYMENT! 🚀")
        print()
        print("GitHub Repository: https://github.com/Zohairmohd02/invoice-fraud-app")
        print()


if __name__ == "__main__":
    helper = AppRunnerDeploymentHelper()
    helper.run()
