const { roles } = require("../utils/roles");

module.exports.isAdmin = (req, res, next) => {
  try {
    const acquiredRoles = req.body.token.roles;
    if (!acquiredRoles.includes(roles.admin)) {
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
