# Invoice Fraud Detection MVP

A full-stack AI-powered invoice fraud detection application built with React, Node.js, and Python machine learning.

## 🚀 Quick Deploy to AWS App Runner

Deploy to AWS in 10 minutes on the free tier!

**[👉 Start here: AWS Quick Start Guide](AWS_QUICKSTART.md)**

## 📋 Architecture

### Services:
- **Frontend**: React 18 + Vite (Port 3000)
- **Backend**: Node.js Express API (Port 4000) 
- **Database**: PostgreSQL (Port 5432)
- **ML Model**: Python TensorFlow (Port 5001)

## 💻 Local Development

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.9+

### Quick Start - Docker Compose

```powershell
# Clone repository
git clone https://github.com/Zohairmohd02/invoice-fraud-app.git
cd invoice-fraud-app

# Run with Docker Compose
docker-compose up --build

# Wait for services to start...
# Open application: http://localhost:3000
```

### Manual Setup

**Setup Backend:**
```bash
cd backend
npm install
npm start
```

**Setup Frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

**Setup ML Model (new terminal):**
```bash
cd model
pip install -r requirements.txt
python app.py
```

## 🌐 Production Deployment

### Deploy to AWS App Runner (Recommended)
- ✅ Free tier eligible (0.25 vCPU, 512 MB)
- ✅ Automatic deployments from GitHub
- ✅ Built-in SSL/HTTPS
- 📖 [See: AWS_QUICKSTART.md](AWS_QUICKSTART.md) or [DEPLOYMENT.md](DEPLOYMENT.md)

### Run with Docker
```bash
# Build image
docker build -t invoice-fraud-app .

# Run container
docker run -p 3000:3000 invoice-fraud-app
```

## 📁 Project Structure

```
invoice-fraud-app/
├── frontend/           # React + Vite app
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/            # Express.js API
│   ├── src/
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth, error handling
│   └── package.json
├── model/             # Python ML model
│   ├── app.py
│   └── requirements.txt
├── Dockerfile         # Production build
├── docker-compose.yml # Local development
└── deployments guides
    ├── AWS_QUICKSTART.md
    ├── DEPLOYMENT.md
    └── deploy_helper.py
```

## 🔧 API Endpoints

```
POST   /api/auth/signup     - Create account
POST   /api/auth/login      - Login
GET    /api/invoices        - List invoices  
POST   /api/invoices        - Add invoice
GET    /api/health          - Health check
```

## 🤖 ML Fraud Detection

The model uses TensorFlow autoencoders to detect anomalies:
- Trained on synthetic invoice data
- Computes risk scores (0-1)
- Flags high-risk invoices automatically

## 📊 Database

PostgreSQL schema includes:
- Users table (authentication)
- Invoices table (fraud detection)
- Risk scores and flagging

## 🔐 Security

- JWT authentication
- Bcrypt password hashing
- CORS configuration
- Input validation & sanitization

## 🧪 Testing

```bash
# Backend tests (if configured)
cd backend && npm test

# Frontend tests (if configured)
cd frontend && npm test
```

## 📦 Dependencies

### Frontend
- React 18.2.0
- Vite 5.2.0
- Axios 1.4.0

### Backend
- Express 4.22.1
- JWT 9.0.2
- PostgreSQL driver
- SQLite3 (dev)

### Model
- TensorFlow
- Scikit-learn
- Pandas

## 🐛 Troubleshooting

### Port already in use?
```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Docker build fails?
```bash
# Clean and rebuild
docker-compose down -v
docker-compose up --build
```

### Database connection error?
- Ensure PostgreSQL is running
- Check DATABASE_URL environment variable
- Verify credentials

## 🚀 Deployment Guides

- **Quick Start**: [AWS_QUICKSTART.md](AWS_QUICKSTART.md)
- **Detailed Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Automation Helper**: `python deploy_helper.py`

## 📝 Notes

- The ML model trains on synthetic data on first run
- Backend automatically queries model for risk scores
- Frontend displays Real-time risk assessment
- Supports file upload (multipart form data)

## 👤 Author

Zohair Mohd | Invoice Fraud Detection MVP

## 📄 License

MIT

## 🤝 Contributing

Pull requests welcome! For major changes, open an issue first.

## 📞 Support

For issues and questions:
- GitHub Issues: https://github.com/Zohairmohd02/invoice-fraud-app/issues
- AWS Docs: https://docs.aws.amazon.com/apprunner/
