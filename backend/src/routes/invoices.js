const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Ensure uploads folder exists and configure disk storage for multer
const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  }
});
const upload = multer({ storage });

// Allowed MIME types for uploaded invoice files
const ALLOWED_MIMES = ['application/pdf', 'image/png', 'image/jpeg'];

router.post('/', upload.single('file'), asyncHandler(async (req, res) => {
  // Support either JSON body or multipart form fields
  const body = req.body || {};

  // If a file was sent, validate MIME and attach file metadata + public URL
  if (req.file) {
    if (!ALLOWED_MIMES.includes(req.file.mimetype)) {
      // remove file if invalid
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(415).json({ error: 'File format not supported.' });
    }
    const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:4000'}/uploads/${req.file.filename}`;
    body.file = { originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size, filename: req.file.filename, url: fileUrl };
  }

  // Basic validation
  if (!body.vendor || !body.amount) return res.status(400).json({ error: 'vendor and amount are required' });
  if (isNaN(Number(body.amount)) || Number(body.amount) <= 0) return res.status(400).json({ error: 'amount must be a positive number' });

  // Safe parse for metadata if supplied as a string
  let metadata = null;
  if (body.metadata) {
    if (typeof body.metadata === 'string') {
      try {
        metadata = JSON.parse(body.metadata);
      } catch (e) {
        // If metadata is not valid JSON, keep it as raw string in metadata field
        metadata = { raw: body.metadata };
      }
    } else {
      metadata = body.metadata;
    }
  }

  const invoice = {
    vendor: body.vendor,
    amount: Number(body.amount),
    date: body.date || null,
    metadata: metadata || body.file || {}
  };

  // Call model service
  const modelUrl = process.env.MODEL_URL || 'http://localhost:5001/predict';
  let resp;
  try {
    resp = await axios.post(modelUrl, { invoice }, { timeout: 20000 });
  } catch (err) {
    // bubble a clear error to client
    console.error('model call failed', err.message || err);
    return res.status(502).json({ error: 'model service unavailable' });
  }

  const { risk_score = 0, flagged: modelFlagged = false } = resp.data || {};

  // Heuristic checks using historical DB data
  const alerts = [];
  let heuristicFlag = false;

  try {
    // Duplicate detection: same vendor, amount, date
    if (invoice.vendor && invoice.amount && invoice.date) {
      const dupQ = await db.query(
        `SELECT COUNT(*) as c FROM invoices WHERE vendor=$1 AND amount=$2 AND invoice_date=$3`,
        [invoice.vendor, invoice.amount, invoice.date]
      );
      const dupCount = dupQ.rows && dupQ.rows[0] && (dupQ.rows[0].c || dupQ.rows[0].count || dupQ.rows[0].COUNT || 0);
      const c = Number(dupCount || 0);
      if (c > 0) {
        alerts.push('duplicate_invoice_detected');
        heuristicFlag = true;
      }
    }

    // Historical amount anomaly for vendor
    if (invoice.vendor && invoice.amount) {
      const histQ = await db.query(
        `SELECT amount FROM invoices WHERE LOWER(vendor)=LOWER($1) ORDER BY created_at DESC LIMIT 100`,
        [invoice.vendor]
      );
      const amounts = (histQ.rows || []).map(r => Number(r.amount || r.AMOUNT || 0)).filter(a => !isNaN(a));
      if (amounts.length >= 3) {
        const mean = amounts.reduce((s, v) => s + v, 0) / amounts.length;
        const variance = amounts.reduce((s, v) => s + (v - mean) * (v - mean), 0) / amounts.length;
        const std = Math.sqrt(variance);
        if (invoice.amount > mean + 3 * std) {
          alerts.push('amount_anomaly_vs_history');
          heuristicFlag = true;
        }
      }
    }

    // Mismatched vendor check: invoices with same amount+date but different vendor
    if (invoice.amount && invoice.date && invoice.vendor) {
      const simQ = await db.query(
        `SELECT vendor FROM invoices WHERE amount=$1 AND invoice_date=$2 LIMIT 5`,
        [invoice.amount, invoice.date]
      );
      const otherVendors = (simQ.rows || []).map(r => (r.vendor || r.VENDOR || '').toLowerCase()).filter(v => v && v !== invoice.vendor.toLowerCase());
      if (otherVendors.length > 0) {
        alerts.push('vendor_mismatch_with_similar_records');
        heuristicFlag = true;
      }
    }
  } catch (e) {
    console.warn('heuristic checks failed', e && e.message ? e.message : e);
  }

  const finalFlagged = Boolean(modelFlagged || heuristicFlag || (invoice.amount > 10000));

  // Attach alerts into metadata so they are queryable later
  const storedMeta = invoice.metadata && typeof invoice.metadata === 'object'
    ? Object.assign({}, invoice.metadata, { alerts })
    : { ...(invoice.metadata || {}), alerts };

  // if a file was uploaded attach file url into metadata (if not already present)
  if (body.file && body.file.url) {
    if (typeof storedMeta === 'object') storedMeta.file_url = body.file.url;
  }
  const meta = JSON.stringify(storedMeta);

  const result = await db.query(
    `INSERT INTO invoices(vendor, amount, invoice_date, metadata, risk_score, flagged)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [invoice.vendor || null, invoice.amount || null, invoice.date || null, meta, risk_score, finalFlagged ? 1 : 0]
  );

  // Include alerts in response for immediate UI feedback
  const inserted = result.rows && result.rows[0] ? result.rows[0] : result;
  res.status(201).json(Object.assign({}, inserted, { alerts }));
}));

router.get('/', asyncHandler(async (req, res) => {
  const q = await db.query('SELECT * FROM invoices ORDER BY created_at DESC LIMIT 100');
  res.json(q.rows);
}));

// Feedback endpoint: allow users to mark false positives and add comments
router.post('/:id/feedback', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { false_positive = false, comment = '' } = req.body || {};
  // record feedback
  await db.query(
    `INSERT INTO feedback(invoice_id, false_positive, comment) VALUES($1,$2,$3)`,
    [id, false_positive ? 1 : 0, comment || null]
  );
  // if user marked false positive, clear flagged on invoice
  if (false_positive) {
    await db.query(`UPDATE invoices SET flagged=0 WHERE id=$1`, [id]);
  }
  res.json({ ok: true });
}));

module.exports = router;
