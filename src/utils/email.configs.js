const nodemailer = require("nodemailer");

module.exports.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "chatroomsmailer@gmail.com", // generated ethereal user
      pass: "uzbyoznekppepjxl", // generated ethereal password
    },
  });

  
module.exports.sendConfMail = async (destMail, destName, verifCode) => {
  let info = await this.transporter.sendMail({
    from: '"chatrooms official" <chatroomsmailer@gmail.com>', // sender address
    to: destMail, // list of receivers
    subject: "Please confirm your email", // Subject line
    html: this.registerMailHtmlBody(destName, verifCode), // html body
  });
};

module.exports.registerMailHtmlBody = (destName, verifCode) => {
    return `Hi Mr. ${destName},<br/>this is your verification code : <br/> <h2 style="letter-spacing : 2px"> ${verifCode} </h2>,<br/> please copy and paste it in the code verification page.`;
}