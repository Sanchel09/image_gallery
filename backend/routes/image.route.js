import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { deleteData, uploadImages } from "../controllers/image.controller.js";
import { upload } from "../middleware/upload.js";
import { getImagedByFolderId } from "../controllers/folder.controller.js";

const router = express.Router();

router
  .post("/upload", authenticate, upload.array("images", 100), uploadImages)
  .get("/", authenticate, getImagedByFolderId)
  .delete("/:id", authenticate, deleteData);
export default router;
