"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class SubCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SubCategory.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });

      SubCategory.belongsTo(models.SubCategory, {
        foreignKey: "parent_id",
        as: "parentSubCategory",
      });

      SubCategory.hasMany(models.SubCategory, {
        foreignKey: "parent_id",
        as: "childrenSubCategories",
      });

      SubCategory.hasMany(models.Folder, {
        foreignKey: "sub_category_id",
        as: "folders",
      });
    }
  }
  SubCategory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SubCategory",
    },
  );
  return SubCategory;
};
