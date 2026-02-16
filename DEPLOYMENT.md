# AWS App Runner Deployment Guide

## Overview
This guide will help you deploy the Invoice Fraud Detection app to AWS App Runner for free using the AWS free tier.

## Prerequisites
- AWS Account (free tier eligible)
- GitHub Account (already set up)
- Invoice Fraud app pushed to GitHub Repository: https://github.com/Zohairmohd02/invoice-fraud-app

## Step 1: Create AWS App Runner Service

### 1.1 Log in to AWS Console
1. Go to https://aws.amazon.com
2. Click "Sign In to the Console"
3. Log in with your AWS account credentials

### 1.2 Navigate to App Runner
1. Search for "App Runner" in the AWS search bar
2. Click on "AWS App Runner" in the results
3. You should see the App Runner dashboard

### 1.3 Create New Service
1. Click the **"Create an App Runner service"** button (or **"Create service"** if you already have services)
2. You'll see the service creation wizard

## Step 2: Configure Source Repository

### 2.1 Choose Repository Type
1. Select **"Source code repository"** (not Container registry)
2. Click **"GitHub"** as the provider
3. Click **"Connect GitHub"** if not already connected

### 2.2 Authorize AWS Access to GitHub
1. Click **"Authorize aws-apprunner"** button
2. GitHub will ask for permission - click **"Authorize AWS Connector for GitHub"**
3. Choose **"Only select repositories"** and select:
   - `Zohairmohd02/invoice-fraud-app`
4. Click **"Authorize"**

### 2.3 Select Repository
1. Select Repository: `Zohairmohd02/invoice-fraud-app`
2. Select Branch: `main`
3. Click **"Next"**

## Step 3: Build Settings

### 3.1 Configure Builder
1. Select **"Dockerfile"** as the build method
2. Set Dockerfile path: `Dockerfile` (default)
3. Set Build context: `.` (root directory)

### 3.2 Build Configuration
Keep default settings:
- Output image format: Docker
- Build time ENV variables: (leave empty unless needed)

### 3.3 Click "Next"

## Step 4: Service Configuration

### 4.1 Service Settings
- **Service name**: `invoice-fraud-app` (or your preferred name)
- **Port**: `3000` (matches our backend port)
- **Environment variables** (optional - add if needed):
  - `NODE_ENV`: production
  - `DATABASE_URL`: (if using external database)

### 4.2 Network Settings
- **Ingress**: Public (allow internet traffic)
- **Outboud traffic**: Default (allow internet)

### 4.3 Resource Configuration (Free Tier)
- **CPU**: 0.25 vCPU (512 MB memory) - **FREE**
- **Memory**: 512 MB - **FREE**
- **Concurrency**: 100 (default)

### 4.4 Auto Scaling
- **Min instances**: 1
- **Max instances**: 2 (free tier allows up to 2)

### 4.5 Health Check
- **Path**: `/api/health`
- **Interval**: 5 seconds
- **Timeout**: 2 seconds

## Step 5: Review and Deploy

### 5.1 Review Settings
- Verify all settings are correct
- Ensure repository, branch, and Dockerfile are correct

### 5.2 Create Service
1. Click **"Create & deploy"**
2. AWS will start the deployment process
3. You'll see: "Deployment in progress..."

### 5.3 Wait for Deployment
The deployment typically takes 3-5 minutes:
1. **Build stage**: Docker image is built (1-2 minutes)
2. **Push stage**: Image is pushed to ECR (30 seconds)
3. **Deploy stage**: App Runner starts the service (1-2 minutes)

## Step 6: Get Your Live URL

### 6.1 View Service Details
1. Navigate to App Runner dashboard
2. Click on your service: `invoice-fraud-app`
3. Look for **Service URL** in the service details
   - Format: `https://xxxxx.us-east-1.apprunner.amazonaws.com`

### 6.2 Test Your Application
Visit the URL in your browser:
```
https://xxxxx.us-east-1.apprunner.amazonaws.com
```

You should see your React frontend loaded!

### 6.3 Test API Endpoints
Test the backend API:
```bash
# Health check
curl https://xxxxx.us-east-1.apprunner.amazonaws.com/api/health

# Or test in browser
https://xxxxx.us-east-1.apprunner.amazonaws.com/api/health
```

## Step 7: Automatic Deployments

### 7.1 Enable Auto Deployment
1. Go back to your App Runner service
2. Click on the **"Deployments"** tab
3. You should see automatic deployments enabled by default
4. Whenever you push to the `main` branch, App Runner will automatically deploy

### 7.2 Verify Auto Deploy
1. Make a small change to your code
2. Commit and push to GitHub
3. Watch the App Runner dashboard for automatic deployment

## Monitoring & Troubleshooting

### Check Logs
1. In App Runner service dashboard
2. Click **"Logs"** tab
3. View deployment and application logs

### Common Issues

**Issue**: "Deployment Failed"
- Check AWS CloudWatch logs
- Verify Dockerfile syntax
- Ensure all dependencies are installed

**Issue**: "Health check failing"
- Verify backend is listening on port 3000
- Check `/api/health` endpoint responds with 200

**Issue**: "Out of memory"
- Increase memory allocation (may incur charges outside free tier)
- Optimize Node.js memory usage

## Cost Information

### Free Tier Coverage
- 1 always-on service with 0.25 vCPU and 512 MB memory: **FREE**
- Data transfer: 1 GB free per month
- Additional services/resources may incur charges

For free tier details: https://aws.amazon.com/apprunner/pricing/

## Update Pipeline

To deploy updates:
```bash
# Make changes locally
git add .
git commit -m "Update description"
git push origin main

# App Runner will automatically detect and deploy
```

## Custom Domain (Optional)

To add a custom domain:
1. Go to App Runner service settings
2. Click **"Add custom domain"**
3. Enter your domain
4. Update DNS records as instructed
5. Wait for SSL certificate verification

## Success Checklist

- [x] GitHub repository created and pushed
- [x] Deployment files (Dockerfile, etc.) added
- [x] AWS App Runner service created
- [x] GitHub connected to App Runner
- [x] Deployment successful
- [x] Live URL obtained
- [x] Frontend accessible
- [x] API endpoint working
- [x] Auto-deployment enabled

## Your Live App URL

Once deployed, your app will be available at:
```
https://[service-name].us-east-1.apprunner.amazonaws.com
```

---

**Need Help?**
- AWS App Runner Docs: https://docs.aws.amazon.com/apprunner/
- Troubleshooting: https://docs.aws.amazon.com/apprunner/latest/dg/troubleshoot.html
