// server/src/utils/response.js

export function successResponse(res, message, data = null, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(res, message, data = null, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message,
    data,
  });
}