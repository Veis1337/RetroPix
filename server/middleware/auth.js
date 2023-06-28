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
        // Invalid token, but allow guest users to proceed
        req.user = { id: 'Guest' };
        next();
      } else {
        req.user = user;
        next();
      }
    });
  }
}

module.exports = {
  authenticateToken,
};
