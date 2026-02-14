const express = require('express');
const app = express();
app.use(express.json());

// Simple mock model: scales risk by amount and returns flagged true for >0.35 or amount>10000
app.post('/predict', (req, res) => {
  const invoice = (req.body && req.body.invoice) || {};
  const amount = Number(invoice.amount || 0) || 0;
  // very small deterministic heuristic for mock
  const risk_score = Math.min(1, Math.abs(amount) / 30000);
  const flagged = risk_score > 0.35 || amount > 10000;
  res.json({ risk_score, flagged });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.MODEL_PORT || 5001;
app.listen(port, () => console.log(`Mock model listening on ${port}`));
