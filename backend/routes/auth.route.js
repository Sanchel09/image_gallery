import express from "express";
import {
  loginUser,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);

export default router;
