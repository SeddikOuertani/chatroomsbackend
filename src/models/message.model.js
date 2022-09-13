const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define collection and schema
let Message = new Schema(
  {
    userId: String,
    text: String,
    hasImage: Boolean,
  },
  { collection: "Message", timestamps: true }
);

module.exports = mongoose.model("Message", Message);
