import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import ejs from 'ejs';

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

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.join(path.dirname(__filename), '../views/contact.ejs');

export function sendEmailContact(email, fullName, message) {
  ejs.renderFile(
    __dirname,
    { email, fullName, message },
    (err, htmlTemplate) => {
      if (err) {
        console.log(err);
      } else {
        transporter.sendMail(
          {
            from: `Homiq Contact <${process.env.GOOGLE_APP_EMAIL}>`,
            to: email,
            subject: 'Thank you for contacting Homiq',
            html: htmlTemplate,
          },
          (err, info) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log(info.accepted);
          }
        );
      }
    }
  );
}
