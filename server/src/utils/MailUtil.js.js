const mailer = require("nodemailer");

const sendingMail = async (to, subject, text) => {
  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: "darshandeesa009@gmail.com",
      pass: "eusl gjvk jopd hhsx",
    },
  });

  const mailOptions = {
    from: "darshandeesa009@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  const mailresponse = await transporter.sendMail(mailOptions);

  return mailresponse;
};

module.exports = { sendingMail };
