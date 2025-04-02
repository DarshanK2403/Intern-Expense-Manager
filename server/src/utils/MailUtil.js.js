const mailer = require("nodemailer");

const sendingMail = async (to, subject, htmlContent) => {
  const transporter = mailer.createTransport({
    service: process.env.MAIL_SERVICE,
    secure: true,
    headers:{
      'X-Priority': 1,
      "X-Gmail-Labels": "Inbox, Primary", 
    },
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_EMAIL,
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
