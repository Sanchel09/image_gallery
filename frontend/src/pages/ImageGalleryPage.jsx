import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Trash2 } from "lucide-react";
import AppModal from "../components/public/AppModal";

const ImageGalleryPage = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [images, setImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Fetch folders on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("/categories");
    setCategories(res.data.data);
  };

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

  const fetchFoldersBySubCategory = async (subCategoryId) => {
    const res = await axios.post(`/subcategories/folders`, {
      id: subCategoryId,
    });
    setFolders(res.data.data.folders);
  };

  const fetchSubcategories = async (categoryId) => {
    const res = await axios.post(`/categories/subcategories`, {
      id: categoryId,
    });
    let finalData = res.data.data.filter((el) => el.folderCount > 0);
    setSubcategories(finalData);
  };

  const fetchFoldersByCategory = async (categoryId) => {
    const res = await axios.post(`/categories/folders`, {
      id: categoryId,
    });
    setFolders(res.data.data.folders);
  };

  // Fetch images when folder changes
  useEffect(() => {
    if (!selectedFolder) {
      setImages([]);
      return;
    }
    fetchImages();
  }, [selectedFolder]);

  const fetchImages = async () => {
    try {
      const res = await axios.post(`/folders/images`, {
        id: selectedFolder,
      });
      setImages(res.data.data.images || []);
    } catch (err) {
      console.error("Failed to fetch images", err);
    }
  };

  const openModal = (image) => {
    setCurrentImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentImage(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/images/${id}`);
      fetchImages();
    } catch (err) {
      console.error("Failed to delete image", err);
    }
  };

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Image Gallery</h1>

      {/* Category / Subcategory / Folder Row */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
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
          <label className="block mb-1 font-medium text-gray-700">Folder</label>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          >
            <option value="">Select Folder</option>
            {folders?.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {images.length === 0 && selectedFolder && (
        <p className="text-gray-500">No images found in this folder.</p>
      )}

      <div>
        <p>Total Images: {images.length} found</p>
      </div>

      <div className="mt-3">
        {images.length > 0 ? (
          <div className="columns-2 sm:columns-4 md:columns-5 lg:columns-6 xl:columns-7 gap-2 space-y-2">
            {images.map((img) => (
              <div
                key={img.id}
                className="break-inside-avoid mb-2 relative cursor-pointer overflow-hidden rounded-xl shadow hover:shadow-lg transition"
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent opening modal
                    handleDelete(img.id);
                  }}
                  className="absolute top-2 right-2 z-10 bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold hover:bg-red-700 transition cursor-pointer"
                  title="Delete Image"
                >
                  <Trash2 size={16} />
                </button>

                <img
                  src={img.optimized_url || img.optimized_path}
                  alt={img.original_path}
                  className="w-full object-cover rounded-xl transform hover:scale-105 transition duration-300"
                  onClick={() => openModal(img)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No images found in this folder.</p>
        )}
      </div>

      {/* Modal */}
      <AppModal
        closeModal={closeModal}
        currentImage={currentImage}
        modalOpen={modalOpen}
      />
    </div>
  );
};

export default ImageGalleryPage;
