import z from 'zod';

export const testimonialSchema = z.object({
  _id: z.string(),
  user: z.object({
    name: z.string().min(3).trim(),
  }),
  feedback: z.string().trim().nonempty(),
  status: z.literal(['pending', 'accepted']),
});
