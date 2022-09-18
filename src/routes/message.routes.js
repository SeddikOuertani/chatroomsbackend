const { messageValidator } = require("../middlewares/validators");

const { isAuth } = require("../middlewares/auth");

module.exports = (app) => {
  const message = require("../controllers/message.controller");
  var router = require("express").Router();

  router.post("/", isAuth, messageValidator, message.createMessage);
  router.get("/room/:roomId", isAuth, message.getRoomMessages);
  router.get("/user/:userId", isAuth, message.getMessageUser);

  app.use("/api/messages", router);
};
