import express from "express";
import categoryRoute from "./category.route.js";
import authRoute from "./auth.route.js";
import subCategoryRoute from "./subcategory.route.js";
import folderRoute from "./folder.route.js";
import imageRoute from "./image.route.js";
const router = express.Router();

router.use("/categories", categoryRoute);
router.use("/auth", authRoute);
router.use("/subcategories", subCategoryRoute);
router.use("/folders", folderRoute);
router.use("/images", imageRoute);

export default router;
