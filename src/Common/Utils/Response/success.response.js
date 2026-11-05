export const successResponse = (res, statusCode = 200, messsage = 'Done', data = undefined) => {
  return res.status(statusCode).json({
    messsage: messsage,
    data: data,
  });
};
