const { roles } = require("../utils/roles");

module.exports.isUser = (req, res, next) => {
  try {
    const acquiredRoles = req.body.token.roles;
    if (!acquiredRoles.includes(roles.user)) {
      throw "Unothorized";
    } else {
      next();
    }
  } catch  (err){
    console.log(err)
    res.status(401).json({
      error: "Invalid request !",
    });
  }
};
