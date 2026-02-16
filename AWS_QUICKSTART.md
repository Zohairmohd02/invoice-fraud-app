# Quick Start: Deploy to AWS App Runner

## 📋 Prerequisite Checklist
- ✅ GitHub account (Zohairmohd02)
- ✅ AWS account (free tier eligible) 
- ✅ Code pushed to GitHub ✓ (Already done!)

## 🚀 3-Step Quick Start

### Step 1: Open AWS Console (2 minutes)
1. Go to: https://console.aws.amazon.com/
2. Make sure you're in **us-east-1** (N. Virginia) region
3. Search for **"App Runner"** and click it

### Step 2: Create App Runner Service (5 minutes)
1. Click **"Create service"**
2. Choose **"Source repository"** → **"GitHub"**
3. Click **"Connect GitHub"**
4. Authorize AWS to access GitHub
5. Select: `Zohairmohd02/invoice-fraud-app`
6. Branch: `main`
7. Click **"Next"**

### Step 3: Configure and Deploy (5 minutes)
1. **Build Settings:**
   - Builder: Dockerfile
   - Dockerfile path: `Dockerfile`
   - Build context: `.`

2. **Service Settings:**
   - Service name: `invoice-fraud-app`
   - Port: `3000`

3. **Free Tier Settings (Important!):**
   - CPU: **0.25 vCPU**
   - Memory: **512 MB**
   - Min instances: **1**
   - Max instances: **2**

4. Click **"Create & deploy"**
5. ⏳ Wait 3-5 minutes (building Docker image, deploying)

## 📍 Get Your Live URL

Once deployment is complete:
1. Go to App Runner dashboard
2. Click on `invoice-fraud-app` service
3. Find **"Service URL"** - that's your live app!
4. Format: `https://[service-id].us-east-1.apprunner.amazonaws.com`

## ✅ Verify It Works

### Test Frontend
Open the Service URL in your browser - you should see your React app!

### Test Backend API
```
https://[service-url]/api/health
```
Should return: `{"status":"ok"}`

## 🔄 Auto-Deployment

Every time you push to `main` branch on GitHub:
1. App Runner detects the change
2. Automatically builds new Docker image
3. Deploys updated app
4. ✅ 100% automated!

## 💰 Free Tier

- ✅ 1 always-on service: **FREE**
- ✅ 0.25 vCPU + 512 MB: **FREE**
- ✅ 1 GB outbound data/month: **FREE**
- 📊 [Pricing details](https://aws.amazon.com/apprunner/pricing/)

## 🐛 Troubleshooting

### Deployment Failed?
- Check **Logs** tab in App Runner
- Common issue: Docker build error
- Solution: Review error message and fix dockerfile

### App crashes?
- Check application logs in App Runner console
- Verify port 3000 is correct in code

### Still stuck?
- Read DEPLOYMENT.md for detailed instructions
- AWS App Runner docs: https://docs.aws.amazon.com/apprunner/

## 📚 Additional Resources

- Full deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- GitHub repo: https://github.com/Zohairmohd02/invoice-fraud-app
- AWS App Runner: https://aws.amazon.com/apprunner/

---

**Ready?** Open AWS Console now and start deploying! 🎉
