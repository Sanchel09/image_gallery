import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  deleteFolder,
  getFolders,
  getFoldersById,
  getImagedByFolderId,
  insertFolders,
  updateFolder,
} from "../controllers/folder.controller";

const router = express.Router();

router
  .get("/", getFolders) //public - used for gallery display
  .get("/:id", authenticate, getFoldersById)
  .post("/", authenticate, insertFolders)
  .put("/:id", authenticate, updateFolder)
  .delete("/:id", authenticate, deleteFolder)
  .post("/images", getImagedByFolderId); //public;

export default router;
