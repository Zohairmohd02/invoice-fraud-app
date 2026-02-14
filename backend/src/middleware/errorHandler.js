// Centralized error handler for the Express app
module.exports = function errorHandler(err, req, res, next) {
  // If headers already sent, delegate to default handler
  if (res.headersSent) return next(err);
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  const status = err && err.status ? err.status : 500;
  const message = err && err.message ? err.message : 'Internal Server Error';
  res.status(status).json({ error: message });
};
