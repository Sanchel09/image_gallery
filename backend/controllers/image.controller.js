import { deleteImage, handleImageUpload } from "../service/image.service";
import { sendResponse } from "../utils/helper";
import { StatusCodes } from "../utils/statusCodes";

export const uploadImages = async (req, res) => {
  try {
    const { folderId } = req.body;
    const files = req.files;

    if (!folderId || !files?.length) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Folder id and Images are required",
      );
    }

    const images = await handleImageUpload(files, folderId);
    sendResponse(
      res,
      StatusCodes.SUCCESS,
      "Images uploaded successfully",
      images,
    );
  } catch (error) {
    sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteImage(id);
    sendResponse(res, StatusCodes.SUCCESS, "Deleted Successfully");
  } catch (error) {
    sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
