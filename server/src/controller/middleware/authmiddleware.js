// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  console.log('🧠 Incoming Authorization Header:', auth);

  if (!auth || !auth.startsWith('Bearer ')) {
    console.warn('🚫 No valid Authorization header found');
    return res.status(401).json({ message: 'Unauthorized - Missing token' });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Using JWT_SECRET:", JWT_SECRET);
    console.log('✅ Token decoded successfully:', decoded);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
