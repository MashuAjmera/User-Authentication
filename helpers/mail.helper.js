const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: process.env.mailHost,
  port: process.env.mailPORT,
  secure: true,
  auth: {
    user: process.env.mailUser,
    pass: process.env.mailPass,
  },
});

const mail = (mailOptions) => {
  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw Error(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  } catch (err) {
    res.status(400).json("Session token expired. Try Again.");
  }
};

module.exports = mail;
