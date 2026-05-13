import React, { useEffect, useState } from "react";
import axios from "../api/axios";
// import { BASE_URL } from "../utils/Constants";
import { BACKEND_URL } from "../utils/Constants";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ImageUploadPage = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  // const token = localStorage.getItem("token");

  useEffect(() => {
    // fetchFolders();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
      fetchFoldersByCategory(selectedCategory);
    } else {
      setSubcategories([]);
      setSelectedSubcategory("");
      setFolders([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubcategory) {
      fetchFoldersBySubCategory(selectedSubcategory);
    }
  }, [selectedSubcategory]);

  const fetchFoldersByCategory = async (categoryId) => {
    const res = await axios.post(`/categories/folders`, {
      id: categoryId,
    });
    setFolders(res.data.data.folders);
  };

  const fetchFoldersBySubCategory = async (subCategoryId) => {
    const res = await axios.post(`/subcategories/folders`, {
      id: subCategoryId,
    });
    setFolders(res.data.data.folders);
  };

  const fetchCategories = async () => {
    const res = await axios.get("/categories");
    setCategories(res.data.data);
  };

  const fetchSubcategories = async (categoryId) => {
    const res = await axios.post(`/categories/subcategories`, {
      id: categoryId,
    });
    let finalData = res.data.data.filter((el) => el.folderCount > 0);
    setSubcategories(finalData);
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFolder || files.length === 0) return;

    const formData = new FormData();
    formData.append("folderId", selectedFolder);
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setIsUploading(true);
      const res = await axios.post(`/images/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadedImages(res.data.data);
      // alert("Successfully Uploaded Images");
      setFiles([]);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Upload Images</h1>

      <form
        onSubmit={handleUpload}
        className="space-y-4 bg-white p-6 rounded-2xl shadow-md"
      >
        {/* Category, Subcategory, Folder Row */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Category */}
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
              required
            >
              <option value="">Select Category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">
              Subcategory (optional)
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
            >
              <option value="">Select Subcategory</option>
              {subcategories?.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>

          {/* Folder */}
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">
              Folder
            </label>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
              required
            >
              <option value="">Select a Folder</option>
              {folders?.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedFolder && (
          <div className="flex flex-col md:flex-row gap-3">
            {/* Choose Images */}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full text-sm text-gray-600 border border-gray-300 rounded-xl px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-sm text-gray-500 ps-5">Max 100 images.</p>
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              className="flex-none bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:bg-blue-700 transition disabled:opacity-50 self-start"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}
      </form>

      {/* Uploaded Thumbnails */}
      {uploadedImages.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
            Uploaded Thumbnails
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploadedImages.map((img) => (
              <img
                key={img.id}
                src={`${BACKEND_URL}/${img.optimized_path}`}
                alt="Uploaded"
                className="w-full h-32 object-cover rounded-xl shadow"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageUploadPage;
