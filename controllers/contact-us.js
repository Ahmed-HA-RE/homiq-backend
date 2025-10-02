import { sendEmail } from '../utils/nodemailer.js';
import { contactFormSchema } from '../schemas/user.js';

export async function contactForm(req, res, next) {
  try {
    const { name, email } = req.user;
    const { message } = req.body || {};

    const parsedContactForm = contactFormSchema.parse({ name, email, message });

    // Send email
    await sendEmail({
      email,
      subject: 'Thank you for contacting Homiq',
      path: 'contact.ejs',
      data: parsedContactForm,
    });

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    next(error);
  }
}
