const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Bridge App – PU College" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html
    });
    return { success: true };
  } catch (err) {
    console.error('Email send error:', err.message);
    return { success: false, error: err.message };
  }
};

const sendEmailBulk = async (emails, subject, html) => {
  const results = await Promise.allSettled(
    emails.filter(Boolean).map(to => sendEmail({ to, subject, html }))
  );
  return results;
};

module.exports = { sendEmail, sendEmailBulk };
