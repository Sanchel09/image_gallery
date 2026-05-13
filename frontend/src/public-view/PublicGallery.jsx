import { useEffect, useState } from "react";
import publicAxios from "../api/publicAxios";
import AppModal from "../components/public/AppModal";
import CategorySection from "../components/public/CategorySection";
import SubCategorySection from "../components/public/SubCategorySection";
import PublicSidebar from "../components/public/PublicSidebar";
import PublicImageGrid from "../components/public/PublicImageGrid";

const PublicGallery = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [images, setImages] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [rootSubCategories, setRootSubCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [tempData, setTempData] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await publicAxios.get("/categories");
      setCategories(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    try {
      const res = await publicAxios.get(
        `/categories/rootSubCategories/${category.id}`,
      );
      setRootSubCategories(res.data.data);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const handleRootSelection = (item) => {
    if (
      (item.childrenCount && item.childrenCount > 0) ||
      (item.folderCount && item.folderCount > 0)
    ) {
      setTempData((prev) => [...prev, rootSubCategories]);
      getChildrenSubCategories(item);
    } else {
      fetchImages(item);
    }
  };

  const getChildrenSubCategories = async (subCategory) => {
    let data = {
      category_id: selectedCategory.id,
      parent_id: subCategory.id,
    };
    try {
      const res = await publicAxios.post(
        `/categories/childrenSubCategories`,
        data,
      );
      setRootSubCategories(res.data.data);
    } catch (error) {
      console.error("Failed to fetch sub categories", error);
    }
  };

  const fetchImages = async (item) => {
    try {
      const res = await publicAxios.post(`/folders/images`, {
        id: item.id,
      });
      setImages(res.data.data.images || []);
      setSelectedFolder(item);
    } catch (err) {
      console.error("Failed to fetch images", err);
    }
  };

  const handleBack = () => {
    if (tempData.length > 0) {
      let backData = tempData.pop();
      setRootSubCategories(backData);
    } else {
      setRootSubCategories([]);
      setSelectedCategory("");
    }
    setSelectedFolder(null);
    setImages(null);
  };

  const openModal = (image) => {
    setCurrentImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentImage(null);
  };

  return (
    <div className="w-screen h-screen">
      {selectedCategory ? (
        <div className="h-screen w-screen overflow-hidden">
          <div
            className="relative text-center text-7xl bg-cover bg-center text-white font-bold tracking-wider"
            style={
              selectedCategory.imageUrl
                ? { backgroundImage: `url(${selectedCategory.imageUrl})` }
                : { backgroundColor: "black" }
            }
          >
            <button
              onClick={handleBack}
              className="absolute top-5 left-5 z-20 px-4 py-2 text-sm font-medium bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all cursor-pointer"
            >
              ← Back
            </button>

            <div className="bg-black/40 p-20">
              {selectedCategory.name.toUpperCase()}
            </div>
          </div>
          {images ? (
            <div className="flex h-[calc(100vh-220px)] overflow-hidden">
              {/* SIDEBAR */}
              <PublicSidebar
                rootSubCategories={rootSubCategories}
                handleRootSelection={handleRootSelection}
                selectedFolder={selectedFolder}
              />
              {/* MAIN CONTENT (ONLY SCROLL AREA) */}
              <PublicImageGrid images={images} openModal={openModal} />
            </div>
          ) : (
            <SubCategorySection
              rootSubCategories={rootSubCategories}
              handleRootSelection={handleRootSelection}
            />
          )}
        </div>
      ) : (
        <CategorySection
          categories={categories}
          handleCategoryClick={handleCategoryClick}
        />
      )}

      {/* Modal */}
      <AppModal
        closeModal={closeModal}
        currentImage={currentImage}
        modalOpen={modalOpen}
      />
    </div>
  );
};

export default PublicGallery;
