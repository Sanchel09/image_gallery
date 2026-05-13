// import db from "../models/index.js";
import * as db from "../models/index.js";
import fs from "fs/promises";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

export const get = async () => {
  try {
    const categories = await db.Category.findAll();

    const updatedCategories = categories.map((category) => ({
      ...category.toJSON(),
      // imageUrl: `${BASE_URL}/${category.image}`,
      imageUrl: category.image
        ? `${BASE_URL}/${category.image.replace(/\\/g, "/")}`
        : "",
    }));

    return updatedCategories;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getById = async (data) => {
  try {
    const category = await db.Category.findOne({ where: { id: data.id } });
    return category;
  } catch (err) {
    return new Error(err.message);
  }
};

export const insert = async (data, file) => {
  try {
    let imagePath = null;

    if (file) {
      imagePath = file.path;
    }
    const result = await db.Category.create({
      name: data.name,
      description: data.description,
      image: imagePath, // 👈 add this
    });

    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteData = async (data) => {
  try {
    const category = await db.Category.findOne({ where: { id: data.id } });
    if (!category) throw new Error("No data found");

    if (category.image) {
      await fs.unlink(category.image).catch((error) => {});
    }

    const result = await db.Category.destroy({
      where: { id: data.id },
    });
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateData = async (data, updateId) => {
  try {
    const category = await db.Category.findOne({ where: { id: updateId } });
    if (!category) throw new Error("No data found");

    const result = await db.Category.update(
      {
        name: data.name,
        description: data.description,
      },
      { where: { id: updateId } },
    );
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchSubCategories = async (id) => {
  try {
    const category = await db.Category.findByPk(id, {
      include: [
        {
          model: db.SubCategory,
          as: "subcategories",
          include: [
            {
              model: db.Folder,
              as: "folders", // make sure this alias matches your SubCategory → Folder association
              attributes: [], // don't fetch folder data, just count
            },
          ],
          attributes: {
            include: [
              [
                db.sequelize.fn(
                  "COUNT",
                  db.sequelize.col("subcategories.folders.id"),
                ),
                "folderCount",
              ],
            ],
          },
        },
      ],
      group: ["Category.id", "subcategories.id"],
    });
    if (!category) throw new Error("No Category Found");

    const allSubs = await db.SubCategory.findAll({
      where: { category_id: id },
    });
    const subMap = new Map(allSubs.map((sub) => [sub.id, sub.toJSON()]));

    const getParentChain = (sub) => {
      const names = [];
      let current = sub;
      const visited = new Set();

      while (current && current.parent_id) {
        if (visited.has(current.id)) break; // cycle guard
        visited.add(current.id);

        const parent = subMap.get(current.parent_id);
        if (!parent) break;

        names.unshift(parent.name);
        current = parent;
      }

      return names;
    };

    const subcategories = category.subcategories.map((sub) => {
      const subJson = sub.toJSON();
      const chain = getParentChain(subJson);
      const parentName = chain.length > 0 ? chain[chain.length - 1] : null;
      const label =
        chain.length > 0
          ? `${chain.join(" > ")} > ${subJson.name}`
          : subJson.name;
      return {
        ...subJson,
        parentName,
        label,
        folderCount: parseInt(subJson.folderCount) || 0,
      };
    });

    return { ...category.toJSON(), subcategories };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchRootSubCategoriesOrFolder = async (id, parent_id = null) => {
  try {
    let result = [];
    const subcategories = await db.SubCategory.findAll({
      where: { category_id: id, parent_id: parent_id },
      include: [
        {
          model: db.SubCategory,
          as: "childrenSubCategories",
          attributes: [],
        },
        {
          model: db.Folder,
          as: "folders",
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            db.sequelize.fn(
              "COUNT",
              db.sequelize.col("childrenSubCategories.id"),
            ),
            "childrenCount",
          ],
          // folder count
          [
            db.sequelize.fn("COUNT", db.sequelize.col("folders.id")),
            "folderCount",
          ],
        ],
      },
      group: ["SubCategory.id"],
    });

    if (subcategories.length === 0) {
      if (parent_id === null) {
        const folders = await db.Folder.findAll({
          where: { category_id: id },
          attributes: {
            include: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("images.id")),
                "imageCount",
              ],
            ],
          },
          include: [
            {
              model: db.Image,
              as: "images",
              attributes: [],
            },
          ],
          group: ["Folder.id"],
        });
        result = folders;
      } else {
        const folders = await db.Folder.findAll({
          where: { sub_category_id: parent_id },
          attributes: {
            include: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("images.id")),
                "imageCount",
              ],
            ],
          },
          include: [
            {
              model: db.Image,
              as: "images",
              attributes: [],
            },
          ],
          group: ["Folder.id"],
        });
        result = folders;
      }
    } else {
      result = subcategories;
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchFolders = async (id) => {
  try {
    const category = await db.Category.findByPk(id, {
      include: [
        {
          model: db.Folder,
          as: "folders",
        },
      ],
    });
    if (!category) throw new Error("No Category Found");
    return category;
  } catch (error) {
    throw new Error(error.message);
  }
};
