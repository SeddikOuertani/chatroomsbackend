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

//setting up socket io
const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
  },
});

io.on("connection", (socket) => {
  socket.removeAllListeners();
  socket.on("connecting", userInfo => {
    socket.broadcast.emit("userConnected", userInfo.username);
  })
  socket.on("sendMessage", (msg, roomId, userInfo) => {
    console.log(`User ${msg.userId} has sent a message to room ${roomId}`);
    socket.broadcast.to(roomId).emit("messageSent", msg, userInfo);
  });
  socket.on("joinRoom", (roomId, userInfo) => {
    console.log(`User ${userInfo.username} has joined ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit("roomJoined", userInfo, socket.id);
  });

  socket.on("leaveRoom", (roomId, userInfo) => {
    console.log(`User ${userInfo.username} has left ${roomId}`);
    socket.leave(roomId);
    socket.to(roomId).emit("roomLeft", userInfo, socket.id);
  });

  socket.on("CreateRoom", (roomData) => {
    console.log(
      `User ${userData.creatorId} has created room ${roomData.title}`
    );
  });
  socket.on("disconnectUser", (userInfo) => {
    console.log(userInfo.username+" disconnected")
    socket.broadcast.emit("userDisconnected", userInfo.username)
    socket.disconnect(true)
    console.log(socket.disconnected)
  })
});

// including routes
require("./src/routes/chatroom.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/message.routes")(app);

// Create port
const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log("Connected to port " + port);
});

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});
