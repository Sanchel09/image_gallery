import models from "../models/index.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

export const get = async () => {
  try {
    // Fetch all categories with their direct subcategories and folders
    const categories = await models.Category.findAll({
      include: [
        {
          model: models.SubCategory,
          as: "subcategories",
        },
        {
          model: models.Folder,
          as: "folders",
        },
      ],
    });

    const result = categories.map((category) => {
      const catJson = category.toJSON();

      // Build subcategory tree for this category
      const subcategoryMap = new Map();
      (catJson.subcategories || []).forEach((subcat) => {
        subcat.childrenSubCategories = [];
        subcat.folders = [];
        subcategoryMap.set(subcat.id, subcat);
      });

      const rootSubcategories = [];
      (catJson.subcategories || []).forEach((subcat) => {
        if (subcat.parent_id && subcategoryMap.has(subcat.parent_id)) {
          subcategoryMap
            .get(subcat.parent_id)
            .childrenSubCategories.push(subcat);
        } else {
          rootSubcategories.push(subcat);
        }
      });

      // Distribute folders into matching subcategories (or category-level if none)
      const categoryLevelFolders = [];
      (catJson.folders || []).forEach((folder) => {
        if (
          folder.sub_category_id &&
          subcategoryMap.has(folder.sub_category_id)
        ) {
          subcategoryMap.get(folder.sub_category_id).folders.push(folder);
        } else {
          categoryLevelFolders.push(folder);
        }
      });

      return {
        id: catJson.id,
        name: catJson.name,
        description: catJson.description,
        createdAt: catJson.createdAt,
        updatedAt: catJson.updatedAt,
        folders: categoryLevelFolders,
        subcategories: rootSubcategories,
      };
    });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getById = async (data) => {
  try {
    const folder = await models.Folder.findOne({
      include: [
        {
          model: models.Category,
          as: "category",
        },
        {
          model: models.SubCategory,
          as: "subCategory",
        },
      ],
      where: { id: data.id },
    });
    return folder;
  } catch (err) {
    return new Error(err.message);
  }
};

export const insert = async (payload) => {
  try {
    const buildFolderRecords = async (items) => {
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("No folder items to insert");
      }

      const folders = [];

      for (const item of items) {
        const categoryId = item.categoryId || item.category_id;
        const subCategoryId =
          item.subCategoryId || item.sub_category_id || null;
        const name = item.name;

        if (!name || !categoryId) {
          throw new Error("Each folder must include name and categoryId");
        }

        if (subCategoryId) {
          const subCat = await models.SubCategory.findByPk(subCategoryId);
          if (!subCat) {
            throw new Error(`SubCategory id ${subCategoryId} not found`);
          }
          if (Number(subCat.category_id) !== Number(categoryId)) {
            throw new Error("subCategoryId category must match categoryId");
          }
        }

        folders.push({
          name,
          category_id: categoryId,
          sub_category_id: subCategoryId,
        });
      }

      return folders;
    };

    let folderRecords;

    if (Array.isArray(payload)) {
      folderRecords = await buildFolderRecords(payload);
    } else if (payload && Array.isArray(payload.names)) {
      const categoryId = payload.categoryId || payload.category_id;
      const subCategoryId =
        payload.subCategoryId || payload.sub_category_id || null;

      if (!categoryId) {
        throw new Error("categoryId is required when names array is provided");
      }

      if (subCategoryId) {
        const subCat = await models.SubCategory.findByPk(subCategoryId);
        if (!subCat) {
          throw new Error(`SubCategory id ${subCategoryId} not found`);
        }
        if (Number(subCat.category_id) !== Number(categoryId)) {
          throw new Error("subCategoryId category must match categoryId");
        }
      }

      const names = payload.names;
      if (!Array.isArray(names) || names.length === 0) {
        throw new Error("names must be a non-empty array");
      }

      folderRecords = names.map((name) => ({
        name,
        category_id: categoryId,
        sub_category_id: subCategoryId,
      }));
    } else {
      throw new Error("Invalid payload for folder creation");
    }

    const created = await models.Folder.bulkCreate(folderRecords);
    return created;
  } catch (err) {
    throw new Error(err.message); // Throw error to handle at controller level
  }
};

export const updateData = async (data, updateId) => {
  try {
    const folder = await models.Folder.findOne({ where: { id: updateId } });
    if (!folder) throw new Error("No data found");

    const result = await models.Folder.update(
      {
        name: data.name,
        category_id: data.category_id,
        sub_category_id: data.sub_category_id,
      },
      { where: { id: updateId } },
    );
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteData = async (data) => {
  try {
    const folder = await models.Folder.findOne({ where: { id: data.id } });
    if (!folder) throw new Error("No data found");

    const result = await models.Folder.destroy({
      where: { id: data.id },
    });
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchImages = async (id) => {
  try {
    const folder = await models.Folder.findByPk(id, {
      include: [
        {
          model: models.Image,
          as: "images",
        },
      ],
    });
    if (!folder) throw new Error("No folder found");

    // Add public URLs to each image in the folder
    const imagesWithUrls = folder.images.map((img) => ({
      ...img.dataValues,
      original_url: `${BASE_URL}/${img.original_path}`,
      optimized_url: `${BASE_URL}/${img.optimized_path}`,
    }));

    return { ...folder.dataValues, images: imagesWithUrls };
  } catch (error) {
    throw new Error(error.message);
  }
};
