const mailer = require("nodemailer");

const sendingMail = async (to, subject, htmlContent) => {
  const transporter = mailer.createTransport({
    service: "gmail",
    secure: true,
    headers:{
      'X-Priority': 1,
      "X-Gmail-Labels": "Inbox, Primary", 
    },
    auth: {
      user: "darshandeesa009@gmail.com",
      pass: "eusl gjvk jopd hhsx",
    },
  });

  const mailOptions = {
    from: "darshandeesa009@gmail.com",
    to: to,
    subject: subject,
    html: htmlContent, 
  };

  try {
    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendingMail };
