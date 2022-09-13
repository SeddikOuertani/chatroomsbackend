const { isAuth } = require("../middlewares/auth");
const {isUser} = require("../middlewares/isUser");

module.exports = (app) => {
  const chatroom = require("../controllers/chatroom.controller");
  var router = require("express").Router();
  // Create a new chatroom
  router.post("/", isAuth, isUser, chatroom.create);
  // Retrieve all chatroom
  router.get("/",isAuth, chatroom.getAll);
  // Retrieve a single chatroom with id
  router.get("/:id",isAuth, chatroom.getOne);
  // Update a chatroom with id
  router.put("/:id",isAuth, chatroom.update);
  // Delete a chatroom with id
  router.delete("/:id",isAuth, chatroom.delete);
  app.use("/api/chatrooms", router);
};
