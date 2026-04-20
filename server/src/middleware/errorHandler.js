export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(status).json({ error: message });
}
