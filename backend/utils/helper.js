export const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    status: statusCode,
    message,
    data, // Optional data to send with the response
  });
};
