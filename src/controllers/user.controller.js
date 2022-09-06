const db = require("../models");
const User = db.user;
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

    User.find({ username: loginUser.username }, (error, data) => {
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
        return res.status(403).json({ error: "account not yet verified" });
      }

      if (!bcrypt.compareSync(loginUser.password, data.password)) {
        return res.status(403).json({ error: "Wrong password" });
      }

      loginUser.id = data.id;
      const token = jwt.sign(loginUser, process.env.TOKEN_SECRET);
      data.token = token;

      return res
        .status(400)
        .json({ message: "Logged in successfully", data: data });
    });
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

      //sending back successful data result;
      return res
        .status(200)
        .send({ message: "user created successfully ", data: data });
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
    User.findOneAndUpdate(
      { $where: () => bcrypt.compare(req.body.verifCode, "this.verifCode") },
      { $set: { verifCode: null } },
      (error, data) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ error: error });
        }

        if (!data) {
          return res.status(402).json({ error: "Invalid verification code" });
        }

        return res
          .status(200)
          .json({ message: "Accound verified successfully ", data: data });
      }
    );
  } catch {
    return res.status(401).json({
      error: "Invalid request !",
    });
  }
};
