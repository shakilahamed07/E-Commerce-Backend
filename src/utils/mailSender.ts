import nodemailer, { type Transporter } from "nodemailer";
import config from "../config/index.js";

const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  attachments: {
    filename: string;
    content: Buffer;
    contentType: string;
  }[] = [],
) => {

  // Create a transporter using nodemailer
  const transporter: Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.nodemailer_host_email,
      pass: config.nodemailer_host_password,
    },
  });

  // sent the email
  await transporter.sendMail({
    from: config.nodemailer_host_email,
    to,
    subject,
    text: '',
    html,
    attachments,
  });
};

export default sendEmail;