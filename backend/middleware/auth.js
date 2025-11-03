const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  // Example: Authorization: Bearer <token>
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Make sure user object exists before assigning
    if (!decoded.user || !decoded.user.id) {
      return res.status(401).json({ msg: 'Invalid token payload' });
    }

    req.user = { id: decoded.user.id };
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
