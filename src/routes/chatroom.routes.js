module.exports = (app) => {
  const chatroom = require("../controllers/chatroom.controller");
  var router = require("express").Router();
  // Create a new chatroom
  router.post("/", chatroom.create);
  // Retrieve all chatroom
  router.get("/", chatroom.getAll);
  // Retrieve a single chatroom with id
  router.get("/:id", chatroom.getOne);
  // Update a chatroom with id
  router.put("/:id", chatroom.update);
  // Delete a chatroom with id
  router.delete("/:id", chatroom.delete);
  app.use("/api/chatrooms", router);
};
