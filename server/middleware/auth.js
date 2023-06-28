const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    // No token present, assume guest user
    req.user = { id: 'Guest' };
    next();
  } else {
    jwt.verify(token, 'secret', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  }
}

module.exports = {
  authenticateToken,
};

