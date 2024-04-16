import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import path from "path";
require("dotenv").config();
import ejs from "ejs";

interface OptionsMail {
  email: string;
  subject: string;
  data: string;
  from: string;
  html: string;
}

const sendMail = async (option: OptionsMail): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const { email, subject, from, data, html } = option;
  console.log("to", email);
  const mailOptions = {
    from: `from ${from}`,
    to: email,
    subject,
    data,
    html,
  };
  await transporter.sendMail(mailOptions);
};
export default sendMail;
