const db = require("../models");
const Chatroom = db.chatroom;

// Create and Save a new chatroom
exports.create = async (req, res) => {
  try {
    const newChatroom = req.body;

    Chatroom.create(newChatroom, (error, data) => {
      if (error) {
        res.status(400).json({error : error, message: "Couldn't create chatroom" });
      }
      res
        .status(200)
        .json({ message: "chatroom created successfully", data: data });
    });
  } catch {
    res.status(401).json({
      error: "Invalid request !",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const chatroomId = req.params.chatroomId;
    const newChatroom = req.body;

    Chatroom.updateOne({ _id: chatroomId }, newChatroom, (error, data) => {
      if (error) {
        res.status(400).json({ error : error, message : "Couldn't update chatroom" });
      }
      res
        .status(200)
        .json({ message: "chatroom updated successfully", data: data });
    });
  } catch {
    res.status(401).json({
      error: "Invalid request !",
    });
  }
};

//deletes a chatroom by its id
exports.delete = async (req, res) => {
  try {
    const chatroomId = req.params.chatroomId;

    Chatroom.deleteOne({ _id: chatroomId }, (error, data) => {
      if (error) {
        res
          .status(400)
          .json({ error: error, message: "Couldn't delete chatroom" });
      }
      res
        .status(200)
        .json({ message: "chatroom deleted successfully", data: data });
    });
  } catch {
    res.status(401).json({
      error: "Invalid request !",
    });
  }
};

//updates a chatroom by its id
exports.update = async (req, res) => {
  try {
    const chatroomId = req.params.chatroomId;
    const newChatroom = req.body;

    Chatroom.updateOne({ _id: chatroomId }, newChatroom, (error, data) => {
      if (error) {
        res
          .status(400)
          .json({ error: error, message: "Couldn't update chatroom" });
      }
      res
        .status(200)
        .json({ message: "chatroom updated successfully", data: data });
    });
  } catch {
    res.status(401).json({
      error: "Invalid request !",
    });
  }
};

//returns a chatroom by its id
exports.getOne = async (req, res) => {
  try {
    const chatroomId = req.params.chatroomId;

    Chatroom.findById({ _id: chatroomId }, (error, data) => {
      if (error) {
        res
          .status(400)
          .json({ error: error, message: "Couldn't find chatroom" });
      }
      res
        .status(200)
        .json({ message: "chatroom found successfully", data: data });
    });
  } catch {
    res.status(401).json({
      error: "Invalid request !",
    });
  }
};

// returns all chatrooms
exports.getAll = async (req, res) => {
  try {
    Chatroom.find((error, data) => {
      if (error) {
        res
          .status(400)
          .json({ error: error, message: "Couldn't get chatrooms" });
      }
      res
        .status(200)
        .json({ message: "chatrooms found successfully", data: data });
    });
  } catch {
    res.status(401).json({
      error: "Invalid request !",
    });
  }
};
