const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
    const requestUserId = req.body.userId || req.params.userId;
    if (requestUserId && requestUserId !== userId) {
      throw 'Invalid user ID';
    } else {
        req.token = decodedToken;
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};