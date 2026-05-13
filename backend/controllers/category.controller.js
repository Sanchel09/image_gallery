import {
  insert,
  get,
  getById,
  deleteData,
  updateData,
  fetchSubCategories,
  fetchFolders,
  fetchRootSubCategoriesOrFolder,
} from "../service/category.service.js";
import { sendResponse } from "../utils/helper.js";
import { StatusCodes } from "../utils/statusCodes.js";

export const insertCategories = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "No category data provided",
      ); // 400 for bad request
    }

    // const image = req.file ? req.file.filename : null;

    const result = await insert(
      { name, description },
      req.file, // 👈 pass file here
    );

    // const result = await insert(data); // Insert data into DB
    sendResponse(
      res,
      StatusCodes.CREATED,
      "Category(ies) created successfully",
      result,
    );
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while creating categories",
      error.message,
    );
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const data = req.params;
    const result = await getById(data);
    sendResponse(
      res,
      StatusCodes.SUCCESS,
      "Category fetched successfully",
      result,
    );
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while fetching category",
      err.message,
    );
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await get();
    if (categories && categories.length > 0) {
      sendResponse(
        res,
        StatusCodes.SUCCESS,
        "Categories fetched successfully",
        categories,
      );
    } else {
      sendResponse(res, StatusCodes.NO_CONTENT, "No categories found");
    }
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while fetching categories",
      error.message,
    );
  }
};

export const deleteCategory = async (req, res) => {
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

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await updateData(data, id);
    if (result) sendResponse(res, StatusCodes.SUCCESS, "Updated Successfully");
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occured while updating",
      error.message,
    );
  }
};

export const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { id } = req.body; // Category ID
    const result = await fetchSubCategories(id);
    sendResponse(
      res,
      StatusCodes.SUCCESS,
      "Sub Categories fetched successfully",
      result.subcategories,
    );
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error fetching",
      err.message,
    );
  }
};

export const getRootSubCategoriesOrFolderByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fetchRootSubCategoriesOrFolder(id);
    sendResponse(
      res,
      StatusCodes.SUCCESS,
      "Root Sub Categories fetched successfully",
      result,
    );
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error fetching",
      error.message,
    );
  }
};

export const getChildrenSubCategories = async (req, res) => {
  try {
    const { category_id, parent_id } = req.body;
    const result = await fetchRootSubCategoriesOrFolder(category_id, parent_id);
    sendResponse(
      res,
      StatusCodes.SUCCESS,
      "Sub Categories fetched successfully",
      result,
    );
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error fetching",
      error.message,
    );
  }
};

export const getFoldersByCategory = async (req, res) => {
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
      "Error fetching",
      error.message,
    );
  }
};
