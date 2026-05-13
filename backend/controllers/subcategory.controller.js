import {
  deleteData,
  fetchFolders,
  get,
  getById,
  insert,
  updateData,
} from "../service/subcategory.service.js";
import { sendResponse } from "../utils/helper.js";
import { StatusCodes } from "../utils/statusCodes.js";

export const insertSubCategory = async (req, res) => {
  try {
    const data = req.body;
    const result = await insert(data);
    sendResponse(
      res,
      StatusCodes.SUCCESS,
      "Sub category added successfully",
      result,
    );
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while creating sub categories",
      error.message,
    );
  }
};

export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await get();
    if (subCategories && subCategories.length > 0) {
      sendResponse(
        res,
        StatusCodes.SUCCESS,
        "Categories fetched successfully",
        subCategories,
      );
    } else {
      sendResponse(
        res,
        StatusCodes.NO_CONTENT,
        "No sub categories found",
        subCategories,
      );
    }
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while fetching sub categories",
      error.message,
    );
  }
};

export const getSubCategoryById = async (req, res) => {
  try {
    const data = req.params;
    const result = await getById(data);
    sendResponse(
      res,
      StatusCodes.SUCCESS,
      "Sub Category fetched successfully",
      result,
    );
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while fetching sub categoryy",
      err.message,
    );
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await updateData(data, id);
    if (result) sendResponse(res, StatusCodes.SUCCESS, "Updated Successfully");
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occured while updating",
      err.message,
    );
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const data = req.params;
    const result = await deleteData(data);
    if (result) sendResponse(res, StatusCodes.SUCCESS, "Deleted Successfully");
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occured while deleting",
      err.message,
    );
  }
};

export const getFoldersBySubCategory = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await fetchFolders(id);
    sendResponse(
      res,
      StatusCodes.SUCCESS,
      "Folders fetched successfully",
      result,
    );
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occured while deleting",
      error.message,
    );
  }
};
