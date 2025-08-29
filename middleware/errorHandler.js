function errorHandler(err, req, res, next) {
  const statusCode = err.status ? err.status : 500;

  const errorMessage = {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  };

  res.status(statusCode).json(errorMessage);
  next();
}

export default errorHandler;
