import z, { ZodError } from 'zod';
import mongoose from 'mongoose';

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

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: `Oops! The ID you provided ${err.value} doesn’t look right. Please check and try again.`,
    });
  }

  // Multer's MISSING_FIELD_NAME
  if (err.code === 'MISSING_FIELD_NAME') {
    return res.status(400).json({
      message:
        'Required file field is missing. Please make sure all required files are included.',
    });
  }

  // Multer's MISSING_FIELD_NAME
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      message:
        "File upload error. Please make sure you're uploading only the expected file.",
    });
  }

  res.status(statusCode).json({ message: err.message });
}

export default errorHandler;
