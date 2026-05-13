import express from "express";
import categoryRoute from "./category.route";
import authRoute from "./auth.route";
import subCategoryRoute from "./subcategory.route";
import folderRoute from "./folder.route";
import imageRoute from "./image.route";
const router = express.Router();

router.use("/categories", categoryRoute);
router.use("/auth", authRoute);
router.use("/subcategories", subCategoryRoute);
router.use("/folders", folderRoute);
router.use("/images", imageRoute);

export default router;
