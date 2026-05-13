import { login, refreshAccessToken, logout } from "../service/auth.service.js";
import { sendResponse } from "../utils/helper.js";
import { StatusCodes } from "../utils/statusCodes.js";

export const loginUser = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = req.ip;
    const data = await login(req.body, userAgent, ipAddress);
    sendResponse(res, StatusCodes.SUCCESS, "Login Successfull", data);
  } catch (err) {
    sendResponse(res, StatusCodes.UNAUTHORIZED, err.message);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const data = await refreshAccessToken(req.body.refreshToken);
    sendResponse(res, StatusCodes.SUCCESS, "Token Refreshed", data);
  } catch (err) {
    sendResponse(res, StatusCodes.UNAUTHORIZED, err.message);
  }
};

export const logoutUser = async (req, res) => {
  try {
    await logout(req.body.userId);
    sendResponse(res, StatusCodes.SUCCESS, "Logged out successfully");
  } catch (err) {
    sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
};
