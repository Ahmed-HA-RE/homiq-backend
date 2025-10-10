import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';
import dotenv from 'dotenv';
import path from 'path';
import ejs from 'ejs';

dotenv.config();

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY,
  })
);

export const sendEmail = async (options) => {
  const __filename = new URL(import.meta.url).pathname;
  const __dirname = path.join(
    path.dirname(__filename),
    `../views/${options.path}`
  );

  const htmlTemplate = await ejs.renderFile(__dirname, options.data);

  const info = await transport.sendMail({
    from: `Homiq Support <${process.env.GOOGLE_APP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: htmlTemplate,
  });

  console.log('Message sent:', info.messageId);
  return info;
};
