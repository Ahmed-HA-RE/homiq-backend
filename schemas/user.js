import z from 'zod';

export const signUpSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .nonempty({ error: 'Name is required' })
    .regex(/^[a-zA-Z ]+$/, { error: 'Invalid Name' })
    .trim()
    .min(3, { error: 'Must be at least 3 characters' })
    .max(20, { error: 'Must not exceed 20 characters' }),
  email: z
    .string({ error: 'Email is required' })
    .nonempty({ error: 'Email is required' })
    .email({ error: 'Invalid email address' }),
  password: z
    .string({ error: 'Password is required' })
    .nonempty({ error: 'Password is required' })
    .min(6, { error: 'Must be at least 6 characters' })
    .max(20, { error: 'Must not exceed 20 characters' })
    .regex(/(?=.*[A-Z])/, {
      error: 'Password must have at least one Uppercase character',
    })
    .regex(/(?=.*[a-z])/, {
      error: 'Password must have at least one Lowercase character',
    })
    .regex(/[0-9]/, { error: 'Password must have at least one digit' }),
  role: z.string({ error: 'role is required' }).trim().toLowerCase(),
});

export const logInSchema = signUpSchema.pick({ email: true, password: true });

export const contactFormSchema = signUpSchema
  .pick({ email: true, name: true })
  .extend({
    message: z
      .string({ error: 'Message is required' })
      .nonempty({ error: 'Message is required' })
      .trim()
      .min(4, { error: 'Characters must be at least 4 ' })
      .max(400, { error: 'Message must be at most 400 characters' }),
  });

export const resetPasswordSchema = signUpSchema.pick({ password: true });
