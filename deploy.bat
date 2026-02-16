@echo off
REM AWS App Runner Deployment Script for Windows
REM This script helps automate the deployment of the Invoice Fraud App to AWS App Runner

echo ===================================
echo AWS App Runner Deployment Script
echo ===================================
echo.

REM Step 1: Check AWS CLI
echo [1/4] Checking AWS CLI...
aws --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: AWS CLI is not installed
    pause
    exit /b 1
)
echo OK: AWS CLI is installed
echo.

REM Step 2: Verify AWS credentials
echo [2/4] Verifying AWS credentials...
for /f "tokens=2" %%i in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%i
echo OK: AWS Account ID: %ACCOUNT_ID%
echo.

REM Step 3: Display configuration
echo [3/4] Deployment Configuration
echo ===================================
echo Service Name: invoice-fraud-app
echo Repository: Zohairmohd02/invoice-fraud-app
echo Branch: main
echo Region: us-east-1
echo Port: 3000
echo CPU: 0.25 vCPU (Free Tier)
echo Memory: 512 MB (Free Tier)
echo ===================================
echo.

REM Step 4: Display next steps
echo [4/4] Next Steps:
echo.
echo 1. Open AWS Console: https://console.aws.amazon.com/
echo 2. Search for 'App Runner'
echo 3. Click 'Create service'
echo 4. Setup GitHub connection:
echo    - Choose 'Source repository'
echo    - Select 'GitHub'
echo    - Authorize AWS access
echo    - Choose: Zohairmohd02/invoice-fraud-app
echo    - Branch: main
echo.
echo 5. Build Configuration:
echo    - Builder: Dockerfile
echo    - Dockerfile path: Dockerfile
echo    - Build context: .
echo.
echo 6. Service Configuration:
echo    - Service name: invoice-fraud-app
echo    - Port: 3000
echo    - CPU: 0.25 vCPU
echo    - Memory: 512 MB
echo    - Health check path: /api/health
echo.
echo 7. Deploy and get your live URL!
echo.
echo For detailed instructions, see: DEPLOYMENT.md
echo.
pause
