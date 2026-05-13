// import db from "../db/index.js";
import * as db from "../models/index.js";

export const get = async () => {
  try {
    const subCategories = await db.SubCategory.findAll({
      include: [
        {
          model: db.Category,
          as: "category",
        },
        {
          model: db.SubCategory,
          as: "parentSubCategory",
        },
      ],
    });

    // Build nested tree: only roots (parent_id null) + recursive children
    const map = new Map();
    const nodes = subCategories.map((item) => {
      const json = item.toJSON();
      json.childrenSubCategories = [];
      map.set(json.id, json);
      return json;
    });

    const roots = [];
    nodes.forEach((node) => {
      if (node.parent_id) {
        const parent = map.get(node.parent_id);
        if (parent) {
          parent.childrenSubCategories.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const insert = async (data) => {
  try {
    const { name, description, parentId, categoryId } = data;
    if (!parentId && !categoryId) {
      throw new Error("Either parent_id or category_id must be provided");
    }

    let targetCategoryId = categoryId;

    if (parentId) {
      const parent = await db.SubCategory.findByPk(parentId);
      if (!parent) {
        throw new Error("Parent subcategory does not exist");
      }
      targetCategoryId = parent.category_id;
    }

    if (!targetCategoryId) {
      throw new Error("Could not determine category_id");
    }

    if (categoryId && parentId) {
      const parent = await db.SubCategory.findByPk(parentId);
      if (!parent) {
        throw new Error("Parent subcategory does not exist");
      }
      const parentCatId = Number(parent.category_id);
      const providedCatId = Number(categoryId);
      console.log("Parent category_id:", parentCatId);
      console.log("Provided category_id:", providedCatId);
      if (Number.isNaN(parentCatId) || Number.isNaN(providedCatId)) {
        throw new Error("Invalid category_id value");
      }
      if (parentCatId !== providedCatId) {
        throw new Error("parent.category_id must match category_id");
      }
    }

    await db.SubCategory.create({
      name,
      description,
      parent_id: parentId || null,
      category_id: targetCategoryId,
    });

    return { message: "Data has been successfully inserted" };
  } catch (err) {
    throw new Error(err.message); // Throw error to handle at controller level
  }
};

export const getById = async (data) => {
  try {
    const subCategory = await db.SubCategory.findOne({
      where: { id: data.id },
      include: [
        {
          model: db.Category,
          as: "category",
        },
        {
          model: db.SubCategory,
          as: "subCategory",
        },
      ],
    });
    return subCategory;
  } catch (err) {
    return new Error(err.message);
  }
};

export const updateData = async (data, updateId) => {
  try {
    const subCategory = await db.SubCategory.findOne({
      where: { id: updateId },
    });
    if (subCategory) {
      const result = await db.SubCategory.update(
        {
          name: data.name,
          description: data.description,
          parent_id: data.parent_id,
          category_id: data.category_id,
        },
        { where: { id: updateId } },
      );
      return result;
    } else {
      throw new Error("No data found");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteData = async (data) => {
  try {
    const subCategory = await db.SubCategory.findOne({
      where: { id: data.id },
    });
    if (!subCategory) throw new Error("No data found");
    const result = await db.SubCategory.destroy({
      where: { id: data.id },
    });
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchFolders = async (id) => {
  try {
    const subCategory = await db.SubCategory.findByPk(id, {
      include: [
        {
          model: db.Folder,
          as: "folders",
        },
      ],
    });
    if (!subCategory) throw new Error("No Sub Category found");
    return subCategory;
  } catch (error) {
    throw new Error(error.message);
  }
};
