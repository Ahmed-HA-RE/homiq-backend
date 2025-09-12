function errorHandler(err, req, res, next) {
  console.error('Error: ', err);
  const statusCode = err.status ? err.status : 500;

  const errorMessage = {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
    errors: err.errors || null,
  };

  res.status(statusCode).json(errorMessage);
  next();
}

export default errorHandler;
