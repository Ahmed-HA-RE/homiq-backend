import z from 'zod';

export const signUpSchema = z.object({
  name: z
    .string()
    .nonempty({ error: 'Field is required' })
    .regex(/^[a-zA-Z ]+$/, { error: 'Invalid Name' })
    .trim()
    .min(3, { error: 'Must be at least 3 characters' })
    .max(20, { error: 'Must not exceed 20 characters' }),
  email: z
    .string({ error: 'Field is required' })
    .nonempty({ error: 'Field is required' })
    .email({ error: 'Invalid email address' }),
  password: z
    .string()
    .nonempty({ error: 'Field is required' })
    .min(6, { error: 'Must be at least 6 characters' })
    .max(20, { error: 'Must not exceed 20 characters' })
    .regex(/(?=.*[A-Z])/, {
      error: 'Password must have at least one Uppercase character',
    })
    .regex(/(?=.*[a-z])/, {
      error: 'Password must have at least one Lowercase character',
    })
    .regex(/[0-9]/, { error: 'Password must have at least one digit' }),
});

export const logInSchema = signUpSchema.pick({ email: true, password: true });
