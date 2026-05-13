"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Folder, {
        foreignKey: "folder_id",
        as: "folder",
      });
    }
  }
  Image.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      original_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      optimized_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      folder_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Image",
    },
  );
  return Image;
};
