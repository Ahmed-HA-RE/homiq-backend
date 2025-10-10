import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 150,
  message: { error: 'Too many requests, please try again later.' },
});

export default limiter;
