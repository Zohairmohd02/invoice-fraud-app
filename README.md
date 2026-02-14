# Invoice Fraud Detection MVP

This repository contains a simple full-stack MVP for invoice fraud detection.

Services:
- Postgres DB (port 5432)
- Python TensorFlow model service (port 5001)
- Node.js Express backend (port 4000)
- React frontend (port 3000)

Run with Docker Compose:

```powershell
cd "c:\Application #1\invoice-fraud-app"
docker-compose up --build
```

After startup, open http://localhost:3000

Notes:
- The model service trains a tiny autoencoder on synthetic data on first run and exposes `/predict`.
- The backend saves invoices to Postgres and queries the model to compute `risk_score` and `flagged`.
