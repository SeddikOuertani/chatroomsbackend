const {
  registerValidator,
  loginValidator,
  registerConfirmValidator,
  verificationMailValidator,
} = require("../middlewares/validators");

module.exports = (app) => {
  const user = require("../controllers/user.controller");
  var router = require("express").Router();
  // Create a new user
  router.post("/", user.create);
  // Login
  router.post("/login", loginValidator, user.login);
  // Register
  router.post("/register", registerValidator, user.register);
  // Confirm registration
  router.post(
    "/registerconfirm",
    registerConfirmValidator,
    user.registerConfirm
  );
  // Send verification mail
  router.post(
    "/sendconfmail",
    verificationMailValidator,
    user.sendVerificationMail
  );
  // Delete a User with id
  //   router.delete("/:id", user.delete);
  app.use("/api/users", router);
};
