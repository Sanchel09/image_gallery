import {
  deleteData,
  fetchImages,
  get,
  getById,
  insert,
  updateData,
} from "../service/folder.service.js";
import { sendResponse } from "../utils/helper.js";
import { StatusCodes } from "../utils/statusCodes.js";

export const getFolders = async (req, res) => {
  try {
    const folders = await get();
    if (folders && folders.length > 0) {
      sendResponse(
        res,
        StatusCodes.SUCCESS,
        "Folders fetched successfully",
        folders,
      );
    } else {
      sendResponse(res, StatusCodes.NO_CONTENT, "No folders found", folders);
    }
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while fetching folders",
      error.message,
    );
  }
};

export const getFoldersById = async (req, res) => {
  try {
    const data = req.params;
    const result = await getById(data);
    sendResponse(
      res,
      StatusCodes.SUCCESS,
      "Folder fetched successfully",
      result,
    );
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while fetching folder",
      err.message,
    );
  }
};

export const insertFolders = async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "No folder data provided",
      );
    }

    if (Array.isArray(data) && data.length === 0) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "No folder data provided",
      );
    }

    const result = await insert(data);
    sendResponse(
      res,
      StatusCodes.CREATED,
      "Folder(s) created successfully",
      result,
    );
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while creating folder(s)",
      error.message,
    );
  }
};

export const updateFolder = async (req, res) => {
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
      err.message,
    );
  }
};

export const deleteFolder = async (req, res) => {
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

export const getImagedByFolderId = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      sendResponse(res, StatusCodes.BAD_REQUEST, "Id is required");
    }
    const result = await fetchImages(id);

    sendResponse(res, StatusCodes.SUCCESS, "Fetched Successfully", result);
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occured while fetching",
      error.message,
    );
  }
};
