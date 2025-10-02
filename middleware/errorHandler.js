import z, { ZodError } from 'zod';

function errorHandler(err, req, res, next) {
  console.error('Error: ', err);
  const statusCode = err.status || 500;

  if (err instanceof ZodError) {
    const errors =
      z.flattenError(err).fieldErrors || z.flattenError(err).formErrors;
    return res.status(400).json({ errors: errors });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE' && err.field === 'exterior') {
    return res.status(400).json({
      message: 'Please provide 1 exterior image only',
    });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE' && err.field === 'interior') {
    return res.status(400).json({
      message: 'Please provide 2 interior images only',
    });
  }

  if (err.code === 'ERR_JWT_EXPIRED') {
    return res
      .status(401)
      .json({ message: 'Your session has expired. Please log in again.' });
  }

  if (err.code === 'ERR_JWT_INVALID') {
    return res
      .status(401)
      .json({ message: 'Invalid session. Please log in again.' });
  }
  res.status(statusCode).json({ message: err.message });
}

export default errorHandler;
