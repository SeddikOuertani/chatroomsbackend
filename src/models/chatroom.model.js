const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define collection and schema
let Chatroom = new Schema(
  {
    title : String,
    description : String,
    maxSize: Number,
    messageHistory: [{userId: String, text: String, date: Date }],
  },
  { collection: "Chatroom", timestamps: true }
);

module.exports = mongoose.model("Chatroom", Chatroom);
