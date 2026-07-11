const nodemailer = require('nodemailer');

// Generate a test email account using Ethereal (fake email inbox)
const sendEmail = async (to, subject, text) => {
  try {
    // Generate test SMTP service account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();

    // Create a transporter
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Send mail
    let info = await transporter.sendMail({
      from: '"SIWES Admin" <no-reply@siwes.com>',
      to: to,
      subject: subject,
      text: text,
    });

    console.log("✅ Email sent successfully!");
    console.log("📧 Preview URL (Open this to view the email): %s", nodemailer.getTestMessageUrl(info));
    return info;
  } catch (err) {
    console.error("Email error:", err);
  }
};

module.exports = sendEmail;