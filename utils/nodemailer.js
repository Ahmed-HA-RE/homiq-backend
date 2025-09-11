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

export function sendEmail(templateData, pathFile) {
  const __filename = new URL(import.meta.url).pathname;
  const __dirname = path.join(path.dirname(__filename), `../views/${pathFile}`);

  const { email, fullName, message } = templateData;

  ejs.renderFile(__dirname, templateData, (err, htmlTemplate) => {
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
  });
}
