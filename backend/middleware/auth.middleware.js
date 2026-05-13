import jwt from "jsonwebtoken";
import { StatusCodes } from "../utils/statusCodes.js";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Invalid or expired token." });
  }
};
