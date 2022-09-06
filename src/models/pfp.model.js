const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define collection and schema
let Pfp = new Schema(
  {
    userId : String,
    image : String,
  },
  { collection: "Pfp", timestamps: true }
);

module.exports = mongoose.model("Pfp", Pfp);
