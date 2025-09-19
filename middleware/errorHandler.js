import z, { ZodError } from 'zod';

function errorHandler(err, req, res, next) {
  console.error('Error: ', err);
  const statusCode = err.status || 500;

  if (err instanceof ZodError) {
    if (!req.body) {
      res
        .status(400)
        .json({
          errors: 'Request body is required. All fields must be provided.',
        });
    }

    res.status(400).json({ errors: z.flattenError(err).fieldErrors });
  } else {
    res.status(statusCode).json({ message: err.message });
  }
}

export default errorHandler;
