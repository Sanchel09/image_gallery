import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  deleteSubCategory,
  getFoldersBySubCategory,
  getSubCategories,
  getSubCategoryById,
  insertSubCategory,
  updateSubCategory,
} from "../controllers/subcategory.controller";

const router = express.Router();

router
  .get("/", authenticate, getSubCategories)
  .post("/", authenticate, insertSubCategory)
  .get("/:id", authenticate, getSubCategoryById)
  .put("/:id", authenticate, updateSubCategory)
  .delete("/:id", authenticate, deleteSubCategory)
  .post("/folders", getFoldersBySubCategory); //public

export default router;
