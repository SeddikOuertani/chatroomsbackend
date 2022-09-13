const mongoose = require("mongoose");
const { roles } = require("../utils/roles");
const Schema = mongoose.Schema;
// Define collection and schema
let User = new Schema(
  {
    roles: [{ type: String, enum: Object.values(roles) }],
    email: String,
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    verifCode: String,
    age: Number,
    address: String,
    active: Boolean,
    disactivated: Boolean,
    banned: Boolean,
    chatroomMembership: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Chatroom" },
    ],
  },
  { collection: "User", timestamps: true }
);

module.exports = mongoose.model("User", User);
