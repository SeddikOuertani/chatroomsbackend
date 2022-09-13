const express = require("express");
const db = require("./src/models");
const createError = require("http-errors");
const logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");

// using bodyparser middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//using morgan logger
app.use(logger("dev"));

//using cors middleware
app.use(cors({ origin: "http://localhost:3000" }));

// Connecting with mongo db
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// including routes
require("./src/routes/chatroom.routes")(app);
require("./src/routes/user.routes")(app);

//setting up socket io
const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("sendMessage", (msg) => {
    console.log(msg.message);
    socket.broadcast.emit("recieveMessage", msg);
  });
});

// Create port
const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log("Connected to port " + port);
});

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});