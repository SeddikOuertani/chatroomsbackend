const jwt = require("jsonwebtoken");

module.exports.isAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.body.token = decodedToken;
    next();

  } catch (err) {
    console.log(err);
    res.status(401).json({
      error: "Invalid request!",
    });
  }
};
