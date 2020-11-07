require("dotenv").config();
const nodemailer = require("nodemailer");
// Send a reset email
// TODO change to gmail/other provider in production

module.exports = async function sendResetEmail(content) {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_USERNAME, // generated mailtrap user
      pass: process.env.MAILTRAP_PASSWORD, // generated mailtrap password
    },
  });
  const mailOptions = {
    from: '"Some test" <sometest@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Link to reset password", // Subject line
    text: `Someone requested a password reset for the account with user name: ${content.username}. If this was you, you can change your password by clicking on this reset link:
    ${content.resetLink}. 

    This link is valid for 1 hour after the request was made.
    
    Regards.`,
    html: `Someone requested a password reset for the account with user name: ${content.username}. If this was you, you can change your password by clicking on
    <a href="${content.resetLink}" />this reset link</a>. 

    This link is valid for 1 hour after the request was made.
    
    Regards.`, // plain text body
  };

  // send mail with defined transport object
  try {
    const info = await transporter.sendMail(mailOptions);
    if (!info) throw new Error("Could not send email.");
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  } catch (err) {
    next(err);
  }
};
