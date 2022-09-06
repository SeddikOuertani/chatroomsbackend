const { roles } = require("../utils/roles");

module.exports = (req, res, next) => {
  try {
    const acquiredRoles = req.body.token.roles;
    if (!acquiredRoles.include(roles.admin)) {
      throw "Unothorized";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request !"),
    });
  }
};
