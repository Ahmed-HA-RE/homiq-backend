import { sendEmail } from '../utils/nodemailer.js';

export async function contactForm(req, res, next) {
  const regexes = {
    email:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    fullName: /^[a-z ,.'-]+$/i,
  };

  try {
    const { email, fullName, message } = req.body;

    let errors = {};

    if (!email || !regexes.email.test(email) || email === '') {
      errors.email = 'Invalid Email';
    }

    if (!fullName || !regexes.fullName.test(fullName) || fullName === '') {
      errors.fullName = 'Invalid Name';
    }

    if (!message || message === '' || !message.length > 400) {
      errors.message = 'Invalid Desription';
    }

    if (Object.keys(errors).length > 0) {
      const err = new Error('Validation Failed');
      err.errors = errors;
      err.status = 400;
      throw err;
    }

    await sendEmail(
      email,
      fullName,
      `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
      <h2>New Contact Us Message</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>
        `
    );

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    next(error);
  }
}
