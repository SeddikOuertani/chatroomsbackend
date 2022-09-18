const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define collection and schema
let Message = new Schema(
  {
    userId: String,
    roomId: String,
    text: String,
    hasImage: Boolean,
    hasVocal : Boolean,
    hasAttachement : Boolean
  },
  { collection: "Message", timestamps: true }
);

module.exports = mongoose.model("Message", Message);
