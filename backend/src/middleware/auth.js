const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function authMiddleware(req, res, next){
  const h = req.headers.authorization || req.headers.Authorization;
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' });
  const token = h.split(' ')[1];
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(err){
    return res.status(401).json({ error: 'invalid token' });
  }
}

module.exports = authMiddleware;
