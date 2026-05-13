import sharp from "sharp";
import path from "path";
import models from "../models/index.js";
import fs from "fs/promises";

export const handleImageUpload = async (files, folder_id) => {
  const imageEntries = [];

  for (const file of files) {
    const originalPath = file.path;
    const optimizedFilename = "optimized_" + file.filename;
    const optimizedPath = path.join("uploads/optimized", optimizedFilename);

    //Store optimized Image
    await sharp(originalPath).resize(300).toFile(optimizedPath);

    imageEntries.push({
      name: file.originalname,
      original_path: originalPath,
      optimized_path: optimizedPath,
      folder_id,
    });
  }

  const createdImages = await models.Image.bulkCreate(imageEntries);
  return createdImages;
};

export const deleteImage = async (id) => {
  const image = await models.Image.findOne({ where: { id } });
  if (!image) throw new Error("No data found");

  // // Paths to delete
  // const originalPath = path.join("uploads", image.original_path);
  // const optimizedPath = path.join("uploads", image.optimized_path);

  await fs.unlink(image.original_path).catch((error) => {});
  await fs.unlink(image.optimized_path).catch((error) => {});

  const result = await models.Image.destroy({
    where: { id },
  });

  return result;
};
