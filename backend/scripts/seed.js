const db = require('../src/db');

async function seed(){
  const samples = [
    { vendor: 'Acme Co', amount: 1200.50, date: '2026-01-15', risk: 0.05, flagged: false },
    { vendor: 'Globex LLC', amount: 9800.00, date: '2026-01-20', risk: 0.6, flagged: true },
    { vendor: 'Stark Supplies', amount: 450.75, date: '2026-02-01', risk: 0.02, flagged: false },
    { vendor: 'Wayne Enterprises', amount: 15000.00, date: '2026-01-05', risk: 0.8, flagged: true },
    { vendor: 'Umbrella Inc', amount: 2300.00, date: '2026-02-07', risk: 0.25, flagged: false }
  ];

  for (const s of samples){
    try {
      const res = await db.query(
        `INSERT INTO invoices(vendor, amount, invoice_date, metadata, risk_score, flagged) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
        [s.vendor, s.amount, s.date, JSON.stringify({ seeded:true }), s.risk, s.flagged]
      );
      console.log('Inserted:', res.rows && res.rows[0] ? res.rows[0] : res);
    } catch (err) {
      console.error('Insert error', err.message || err);
    }
  }
  process.exit(0);
}

seed();
