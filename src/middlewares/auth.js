const jwt = require('jsonwebtoken');

module.exports.isAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
    const requestUserId = req.body.userId || req.params.userId;
    if (requestUserId && requestUserId !== userId) {
      throw 'Invalid user ID';
    } else {
        req.body.token = decodedToken;
      next();
    }
  } catch  (err){
    console.log(err)
    res.status(401).json({
      error: 'Invalid request!'
    });
  }
};