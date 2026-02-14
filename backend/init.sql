CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  vendor TEXT,
  amount NUMERIC,
  invoice_date DATE,
  metadata JSONB,
  risk_score NUMERIC,
  flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
