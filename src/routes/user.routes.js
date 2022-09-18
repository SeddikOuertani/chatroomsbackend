const { isAuth } = require("../middlewares/auth");
const {
  registerValidator,
  loginValidator,
  registerConfirmValidator,
  verificationMailValidator,
  resetPasswordValidator,
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

  // Reset password
  router.post("/resetpassword", resetPasswordValidator, user.resetPassword);

  // log out
  router.get("/logout/:userId", isAuth, user.logOut);

  // get all connected users 
  router.get("/connected", isAuth, user.getConnectedUsers);
  
  //get single username by his username
  router.get("/username/:username", isAuth, user.getUserByUsername);

  // Delete a User with id
  //   router.delete("/:id", user.delete);
  app.use("/api/users", router);
};
