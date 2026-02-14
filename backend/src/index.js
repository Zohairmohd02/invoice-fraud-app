const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const invoices = require('./routes/invoices');
const auth = require('./routes/auth');
let payments;
try {
	payments = require('./routes/payments');
} catch (e) {
	console.warn('payments route not available:', e && e.message);
	const express = require('express');
	payments = express.Router();
	payments.all('*', (req, res) => res.status(404).json({ error: 'payments route not available' }));
}
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());

// JSON body parser with default limit; parse errors are handled by error middleware below
app.use(express.json());

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/invoices', invoices);
app.use('/api/auth', auth);
app.use('/api/payments', payments);

// Serve a small health endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// serve a lightweight static UI from / (simple HTML/CSS/JS)
app.use('/', express.static(path.join(__dirname, '..', 'public')));

// JSON parse errors from bodyParser (SyntaxError) -> return 400 with details
app.use((err, req, res, next) => {
	if (err && err.type === 'entity.parse.failed') {
		return res.status(400).json({ error: 'Invalid JSON payload' });
	}
	next(err);
});

// Centralized error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || process.env.BACKEND_PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
