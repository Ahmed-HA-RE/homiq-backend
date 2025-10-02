import path from 'path';
import ejs from 'ejs';

export const sendEmail = async (options) => {
  const __filename = new URL(import.meta.url).pathname;
  const __dirname = path.join(
    path.dirname(__filename),
    `./views/${options.path}`
  );

  const htmlTemplate = ejs.renderFile(__dirname, options.data);

  const info = await transporter.sendMail({
    from: `Homiq Contact <${process.env.GOOGLE_APP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: htmlTemplate,
  });

  console.log('Message sent:', info.messageId);
  return info;
};

sendEmail();
