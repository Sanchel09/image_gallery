"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Folder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Folder.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });

      Folder.belongsTo(models.SubCategory, {
        foreignKey: "sub_category_id",
        as: "subCategory",
      });

      Folder.hasMany(models.Image, {
        foreignKey: "folder_id",
        as: "images",
      });
    }
  }
  Folder.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sub_category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Folder",
    }
  );
  return Folder;
};
