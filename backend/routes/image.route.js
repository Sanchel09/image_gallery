import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { deleteData, uploadImages } from "../controllers/image.controller";
import { upload } from "../middleware/upload";
import { getImagedByFolderId } from "../controllers/folder.controller";

const router = express.Router();

router
  .post("/upload", authenticate, upload.array("images", 100), uploadImages)
  .get("/", authenticate, getImagedByFolderId)
  .delete("/:id", authenticate, deleteData);
export default router;
