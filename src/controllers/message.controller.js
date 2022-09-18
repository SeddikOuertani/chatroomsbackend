const db = require("../models");
const Message = db.message;
const MessageImage = db.messageImage;
const User = db.user;

// Create message in room
module.exports.createMessage = async (req, res) => {
  try {
    const { image, text, vocal, attachement, userId, roomId } = req.body;
    let resData = {};

    let message = {
      userId,
      roomId,
      text: text ? text : "",
      hasImage: image ? true : false,
      hasVocal: vocal ? true : false,
      hasAttachement: attachement ? true : false,
    };

    console.log(message);

    //adding message Object to message collection
    Message.create(message, async (error, data) => {
      if (error || !data) {
        return res
          .status(400)
          .send({ message: "Something went wrong!", error: error });
      }

      let imageCreated = null;
      //adding image to image collection
      if (image) {
        try {
          imageCreated = await MessageImage.create({
            messageId: resArray[0].data._id,
            image: image,
          });
        } catch {
          throw "Error saving image";
        }
      }

      return res.status(200).json({
        message: "Message saved Successfully",
        data: { msgData: data, imgData: imageCreated },
      });
    });
  } catch {
    res.status(401).json({
      error: "Invalid request !",
    });
  }
};

// Create message in room
module.exports.getRoomMessages = async (req, res) => {
  try {
    Message.find({ roomId: req.params.roomId }, (error, data) => {
      if (error) {
        return res
          .status(400)
          .send({ message: "Something went wrong", error: error });
      }
      if (!data) return res.status(404).send({ message: "Data not found" });
      return res.status(200).send({ message: "messages found", data: data });
    });
  } catch {
    res.status(401).json({
      error: "Invalid request !",
    });
  }
};

//get message user
module.exports.getMessageUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    User.findOne(
      { _id: userId },
      {
        _id : 1,
        username: 1,
        active: 1,
        banned: 1,
        disactivated: 1,
        roles: 1,
        email: 1,
      },
      (error, data) => {
        if (error) {
          return res
            .status(400)
            .send({ message: "Something went Wrong", error: error });
        }
        if (!data) {
          return res
            .status(404)
            .send({ message: "No user with this identifier found" });
        }
        return res.status(200).send({ message: "User found", data: data });
      }
    );
  } catch (err) {
    console.log(err)
    res.status(401).json({
      error: "Invalid request !",
    });
  }
};
