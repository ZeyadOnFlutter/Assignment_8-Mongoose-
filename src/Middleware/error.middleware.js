export const globalErrorHandler = (error, req, res, next) => {
  const status = error.cause?.status || 500;
  return res.status(status).json({
    err_message: error.message,
    status,
    errors: error.cause?.errors || undefined,
    err_stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
  });
};
