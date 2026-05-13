import express from "express";
import {
  deleteCategory,
  getCategories,
  getCategoryById,
  getChildrenSubCategories,
  getFoldersByCategory,
  getRootSubCategoriesOrFolderByCategory,
  getSubCategoriesByCategory,
  insertCategories,
  updateCategory,
} from "../controllers/category.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload";

const router = express.Router();

router
  .get("/", getCategories) //public route
  .post("/", authenticate, upload.single("image"), insertCategories)
  .get("/:id", authenticate, getCategoryById)
  .delete("/:id", authenticate, deleteCategory)
  .put("/:id", authenticate, updateCategory)
  .post("/subcategories", getSubCategoriesByCategory) // public - used for gallery display
  .get("/rootSubCategories/:id", getRootSubCategoriesOrFolderByCategory) //public
  .post("/childrenSubCategories", getChildrenSubCategories) //public
  .post("/folders", getFoldersByCategory); //public -used for gallery display

export default router;
