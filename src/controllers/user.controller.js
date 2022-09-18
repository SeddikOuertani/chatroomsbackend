const db = require("../models");
const User = db.user;
const Message = db.message;
const Chatroom = db.chatroom;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { generateRandomMinMax } = require("../utils/helper.util");
const { sendConfMail } = require("../utils/email.configs");

// Create and Save a new user
exports.create = async (req, res) => {
  try {
    const newUser = req.body;

    User.create(newUser, (error, data) => {
      if (error) {
        return res.status(400).json({ error: "Couldn't create user" });
      }

      res
        .status(200)
        .json({ message: "user created successfully ", data: data });
    });
  } catch {
    return res.status(401).json({
      error: "Invalid request !",
    });
  }
};

// login user
exports.login = async (req, res) => {
  try {
    const loginUser = req.body;
    if (!loginUser.email) loginUser.email = "";
    if (!loginUser.username) loginUser.username = "";

    User.findOneAndUpdate(
      { $or: [{ email: loginUser.email }, { username: loginUser.username }] },
      { $set: { active: true } },
      (error, data) => {
        if (error) {
          return res.status(400).json({
            error: error,
            message: "Something went wrong; couldn't create user",
          });
        }

        if (!data) {
          return res.status(404).json({ error: "Username not found" });
        }

        if (data.verifCode !== null) {
          return res.status(403).json({ error: "Account not yet activated" });
        }

        if (!bcrypt.compareSync(loginUser.password, data.password)) {
          return res.status(403).json({ error: "Wrong password" });
        }

        //Setting response data
        loginUser.id = data._id;
        loginUser.email = data.email;
        loginUser.username = data.username;
        loginUser.roles = data.roles;
        const token = jwt.sign(loginUser, process.env.TOKEN_SECRET);

        return res.status(200).json({
          message: "Logged in successfully",
          data: loginUser,
          token: token,
        });
      }
    );
  } catch {
    return res.status(401).json({
      error: "Invalid request !",
    });
  }
};

//register user
exports.register = async (req, res) => {
  try {
    //getting user data from request body
    const registerUser = req.body;

    //checking if userFound in database or not
    const userFound = await User.find({
      $or: [{ email: registerUser.email }, { username: registerUser.username }],
    });

    if (userFound.length > 0) {
      if (userFound[0].username === registerUser.username) {
        return res.status(401).send({
          error: "This user name is already userd",
          data: { sameUsername: 1, sameEmail: 0 },
        });
      } else {
        return res.status(401).send({
          error: "This email is already used",
          data: { sameUsername: 0, sameEmail: 1 },
        });
      }
    }

    //Encryptin password
    const encryptedPassword = bcrypt.hashSync(registerUser.password, 10);
    registerUser.password = encryptedPassword;

    //Generating verifCode and encrypting it
    const verifCode = generateRandomMinMax(10000, 99999).toString();
    registerUser.verifCode = bcrypt.hashSync(verifCode, 10);

    //Setting user role
    const roles = ["user"];
    registerUser.roles = roles;

    //creating user in database
    User.create(registerUser, (error, data) => {
      //checking for errors
      if (error) {
        console.error(error);
        return res.status(400).send({ error: error });
      }

      //sending confirmation mail
      sendConfMail(data.email, `${data.firstName} ${data.lastName}`, verifCode);

      const resData = { email: data.email, username: data.username };

      //sending back successful data result;
      return res
        .status(200)
        .send({ message: "user created successfully ", data: resData });
    });
  } catch {
    return res.status(401).json({
      error: "Invalid request !",
    });
  }
};

//send confirm mail independetnly from register request
module.exports.sendVerificationMail = async (req, res) => {
  try {
    const email = req.body.email;

    User.findOne({ email: email }, async (error, data) => {
      if (error) {
        return res.status(401).send({
          error: error,
          message: "Something went wrong with sending mail",
        });
      }

      if (!data) {
        return res.status(404).send({ error: "You must register first" });
      }

      if (data.verifCode === null) {
        return res.status(400).send({ error: "Accound already activated" });
      }

      //Generating verifCode
      const verifCode = generateRandomMinMax(10000, 99999).toString();
      const encryptedVerifCode = bcrypt.hashSync(verifCode, 10);

      //Updating user with new Verification Code
      await User.findOneAndUpdate(
        {
          email: email,
        },
        { $set: { verifCode: encryptedVerifCode } }
      );

      //Sending new email with new verification code
      sendConfMail(email, `${data.firstName} ${data.lastName}`, verifCode);

      return res.status(200).send({ message: "Confirmation mail sent!" });
    });
  } catch {
    return res.status(401).json({
      error: "Invalid request !",
    });
  }
};

// confirm mail
exports.registerConfirm = async (req, res) => {
  try {
    //checking if email is found in database or not
    User.findOne({ email: req.body.email }, (error, data) => {
      if (error) {
        return res
          .status(400)
          .send({ error: error, message: "Something went wrong!" });
      }

      if (!data)
        return res.status(404).send({ error: "This email doesn't exist" });

      if (!bcrypt.compareSync(req.body.verifCode, data.verifCode)) {
        return res.status(403).json({ error: "Wrong verification code" });
      }
    });

    //activating account
    User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { verifCode: null } },
      (error, data) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ error: error });
        }

        const resData = { email: data.email, username: data.username };

        return res
          .status(200)
          .json({ message: "Accound verified successfully ", data: resData });
      }
    );
  } catch {
    return res.status(401).json({
      error: "Invalid request !",
    });
  }
};

// check if email exist or not
module.exports.checkExistEmail = async (req, res) => {
  try {
    //checking if email is found in database or not
    User.findOne({ email: req.body.email }, (error, data) => {
      if (error) {
        return res
          .status(400)
          .send({ error: error, message: "Something went wrong!" });
      }
      if (!data) {
        return res.status(404).send({ error: "This email doesn't exist" });
      }

      return res.status(200).send({ message: "Email found!" });
    });
  } catch {
    return res.status(401).json({
      error: "Invalid request !",
    });
  }
};

//send confirm mail independetnly from register request
module.exports.sendVerificationMail = async (req, res) => {
  try {
    const email = req.body.email;

    User.findOne({ email: email }, async (error, data) => {
      if (error) {
        return res.status(401).send({
          error: error,
          message: "Something went wrong with sending mail",
        });
      }

      if (!data) {
        return res.status(404).send({ error: "You must register first" });
      }

      if (data.verifCode === null) {
        return res.status(400).send({ error: "Accound already activated" });
      }

      //Generating verifCode
      const verifCode = generateRandomMinMax(10000, 99999).toString();
      const encryptedVerifCode = bcrypt.hashSync(verifCode, 10);

      //Updating user with new Verification Code
      await User.findOneAndUpdate(
        {
          email: email,
        },
        { $set: { verifCode: encryptedVerifCode } }
      );

      //Sending new email with new verification code
      sendConfMail(email, `${data.firstName} ${data.lastName}`, verifCode);

      return res.status(200).send({ message: "Confirmation mail sent!" });
    });
  } catch {
    return res.status(401).json({
      error: "Invalid request !",
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    let firstName, lastName;

    //checking if email is found in database or not
    User.findOne({ email: req.body.email }, (error, data) => {
      if (error) {
        return res
          .status(400)
          .send({ error: error, message: "Something went wrong!" });
      }
      if (!data) {
        return res.status(404).send({ error: "This email doesn't exist" });
      }

      // getting firstname and last name from data
      ({ firstName, lastName } = data);
    });

    const encryptedPassword = bcrypt.hashSync(req.body.password, 10);

    console.log("this is where I made it");
    //Updating user with new Password
    await User.findOneAndUpdate(
      {
        email: email,
      },
      { $set: { password: encryptedPassword } }
    );

    console.log("before sending email");

    //sending notification email
    sendPasswordResetMail(email, `${firstName} ${lastName}`, encryptedPassword);
    console.log("after sending email");
  } catch {
    return res.status(401).json({
      error: "Invalid request !",
    });
  }
};

// log out
module.exports.logOut = async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: { active: false } },
      (error, data) => {
        if (error) {
          return res
            .status(400)
            .send({ message: "Something went wrong!", error: error });
        }
        if (!data) {
          return res
            .status(404)
            .send({ message: "No usser with this id found" });
        }
        return res
          .status(201)
          .send({ message: "User logged out successfully" });
      }
    );
  } catch {
    return res.status(401).json({
      error: "Invalid request !",
    });
  }
};

// Get all connected users
module.exports.getConnectedUsers = async (req, res) => {
  try{
    User.find({active : true}, (error, data) => {
      if (error) {
        return res
          .status(400)
          .send({ message: "Something went wrong!", error: error });
      }
      if (!data) {
        return res
          .status(404)
          .send({ message: "No data found" });
      }
      
      const usernames = data.map(user => user.username);
    
      return res.status(200).send({message : "List of connected Users found", data : usernames});
    })
  }catch{
    return res.status(401).json({
      error: "Invalid request !",
    });
  }
}


// Get all connected users
module.exports.getUserByUsername = async (req, res) => {
  try{
    User.findOne({username : req.params.username}, async (error, data) => {
      if (error) {
        return res
          .status(400)
          .send({ message: "Something went wrong!", error: error });
      }
      if (!data) {
        return res
          .status(404)
          .send({ message: `No User with the username ${req.params.username} found` });
      }

      const messagesCount = await Message.count({userId : data._id});   
      const ChatroomsCount = await Chatroom.count({creatorId : data._id});
    
      const resData = {
        username : data.username,
        firstName : data.firstName,
        lastName : data.lastName,
        roles : data.roles,
        email : data.email,
        age : data.age,
        messagesCount : messagesCount,
        chatroomsCount : ChatroomsCount,
      }

      return res.status(200).send({message : "User found", data : resData});
    })
  }catch{
    return res.status(401).json({
      error: "Invalid request !",
    });
  }
}