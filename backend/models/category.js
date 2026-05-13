"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.SubCategory, {
        foreignKey: "category_id",
        as: "subcategories",
      });

      Category.hasMany(models.Folder, {
        foreignKey: "category_id",
        as: "folders",
      });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
      description: DataTypes.STRING,
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Category",
    },
  );

  return Category;
};
