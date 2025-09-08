import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_APP_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export async function sendEmail(email, name, html) {
  const info = await transporter.sendMail({
    from: `Homiq Contact <${process.env.GOOGLE_APP_EMAIL}>`,
    to: {
      name: 'Homiq Support Team',
      address: `${process.env.GOOGLE_APP_EMAIL}`,
    },
    replyTo: email,
    subject: `New Email From ${name}`,
    html,
  });
  console.log(' Message sent:', info.accepted);
}
