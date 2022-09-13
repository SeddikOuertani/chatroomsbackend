const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define collection and schema
let MessageImage = new Schema(
  {
    messageId: {type : mongoose.Schema.Types.ObjectId, ref : "Message"},
    image: String
  },
  { collection: "MessageImage", timestamps: true }
);

module.exports = mongoose.model("MessageImage", MessageImage);
