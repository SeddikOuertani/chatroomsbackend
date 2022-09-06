const express = require("express");
const db = require("./src/models")
const createError = require("http-errors");
require('dotenv').config();

// using express
const app = express();

// using bodyparser middleware
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));

// Connecting with mongo db
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// including routes
require("./src/routes/chatroom.routes")(app);
require("./src/routes/user.routes")(app);


// Create port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});
