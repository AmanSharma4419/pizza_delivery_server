const nodemailer = require("nodemailer");

const sendMailWithPassword = (req, res, next, reciever) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const subject = `Your Pizza-Delivery Account Password`;
    const body = `
      <p>Hello ${reciever.name}, below is your password</p>
      <p>${reciever.password}</p>
      <p>Best regards,</p>
      <p>Pizza Delivery</p>
    `;

    let message = {
      form: process.env.GMAIL_USER,
      to: reciever.email,
      subject: subject,
      html: body,
    };
    transporter
      .sendMail(message)
      .then(() => {
        return res.status(200).json({ data: "mail sent" });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMailWithPassword };
