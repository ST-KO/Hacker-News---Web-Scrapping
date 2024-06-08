import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import dotenv from "dotenv";

dotenv.config();

export async function sendEmail(filePath) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Read the CSV file
  const csvData = await fs.readFile(filePath);

  // send mail with defined transport object
  await transporter.sendMail({
    from: `"put your name" <${process.env.EMAIL_USER}>`, // sender address
    to: "recipient email", // insert the recipients' emails
    subject: "Hacker News Articles", // Subject line
    html: "<b>Please find the attached data file containing the Hacker News articles</b>", // html body
    attachments: [
      {
        filename: filePath.split("/").pop(),
        content: csvData,
        contentType: filePath.endsWith(".csv")
          ? "text/csv"
          : "application/json",
      },
    ],
  });
}
