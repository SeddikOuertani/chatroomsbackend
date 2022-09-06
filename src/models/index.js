const dbConfig = require("../configs/db.config");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.chatroom = require("./chatroom.model");
db.user = require("./user.model");
db.pfp = require("./pfp.model");

module.exports = db;