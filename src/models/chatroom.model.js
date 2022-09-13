const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Message = require("./message.model");
const User = require("./user.model");
// Define collection and schema
let Chatroom = new Schema(
  {
    creatorId: String,
    title: String,
    description: String,
    maxSize: Number,
    public: Boolean,
    key: String,
    messageHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { collection: "Chatroom", timestamps: true }
);

module.exports = mongoose.model("Chatroom", Chatroom);
