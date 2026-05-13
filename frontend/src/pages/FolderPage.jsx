import axios from "../api/axios";
import { useEffect, useState } from "react";

const FolderPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [folderNames, setFolderNames] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
      setSelectedSubcategory("");
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const res = await axios.get("/categories");
    setCategories(res.data.data);
  };

  const fetchSubcategories = async (categoryId) => {
    const res = await axios.post(`/categories/subcategories`, {
      id: categoryId,
    });
    setSubcategories(res.data.data);
  };

  const fetchFolders = async () => {
    const res = await axios.get(`/folders`);
    setFolders(res.data.data);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/folders/${id}`);
      fetchFolders();
    } catch (err) {
      console.error("Failed to delete folder", err);
    }
  };

  const renderFolderList = (folders) => {
    if (!folders || folders.length === 0) return null;
    return (
      <ul className="ml-4 space-y-1">
        {folders.map((folder) => (
          <li
            key={folder.id}
            className="flex justify-between items-center bg-white p-3 shadow hover:shadow-lg transition text-sm text-gray-700"
          >
            <span className="text-gray-800 font-medium">{folder.name}</span>
            <button
              onClick={() => handleDelete(folder.id)}
              className="text-red-600 hover:text-red-800 font-medium transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  };

  const renderSubcategoryTree = (nodes, level = 0) => {
    if (!nodes || nodes.length === 0) return null;

    if (level === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nodes.map((sub) => (
            <div
              key={sub.id}
              className="border border-gray-300 p-3 rounded shadow"
            >
              <div className="text-sm font-semibold text-gray-800">
                {sub.name}
              </div>
              {renderFolderList(sub.folders)}
              {renderSubcategoryTree(sub.childrenSubCategories, level + 1)}
            </div>
          ))}
        </div>
      );
    }

    return (
      <ul className="space-y-2">
        {nodes.map((sub) => (
          <li key={sub.id} style={{ marginLeft: level * 16 }}>
            <div className="text-sm font-semibold text-gray-800">
              {sub.name}
            </div>
            {renderFolderList(sub.folders)}
            {renderSubcategoryTree(sub.childrenSubCategories, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedNewName = newFolderName.trim();
    const finalNames = [...folderNames];

    if (trimmedNewName && !finalNames.includes(trimmedNewName)) {
      finalNames.push(trimmedNewName);
    }

    if (!selectedCategory || finalNames.length === 0) return;

    await axios.post(`/folders`, {
      categoryId: selectedCategory,
      subCategoryId: selectedSubcategory || null,
      names: finalNames,
    });

    setNewFolderName("");
    setFolderNames([]);
    setSelectedCategory("");
    setSelectedSubcategory("");
    fetchFolders();
  };

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Folders</h1>

      {/* Single-row Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-3 mb-6 items-end bg-white p-6 rounded-2xl shadow-md"
      >
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

        {/* Folder Name */}
        <div className="flex-1">
          <label className="block mb-1 font-medium text-gray-700">
            Folder Name
          </label>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
            placeholder="Enter folder name"
          />
        </div>

        {/* Add Button */}
        <div className="flex-none">
          <button
            type="submit"
            // onClick={() => handleSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition transform hover:scale-105"
          >
            Create
          </button>
        </div>
      </form>

      {/* Existing Folders */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Existing Folders
      </h2>
      {folders && folders.length > 0 ? (
        <ul className="space-y-4">
          {folders.map((cat) => {
            const isNested =
              cat.folders?.length > 0 || cat.subcategories?.length > 0;

            return (
              <li key={cat.id} className="bg-white p-4 rounded-2xl shadow ">
                <strong className="text-lg text-gray-800">{cat.name}</strong>

                {/* Category-level folders */}
                {cat.folders?.length > 0 && (
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="font-medium">Category-level folders:</span>{" "}
                    {renderFolderList(cat.folders)}
                  </div>
                )}

                {/* Subcategories */}
                {cat.subcategories?.length > 0 && (
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="font-medium">Subcategories:</span>{" "}
                    {renderSubcategoryTree(cat.subcategories)}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No folders found.</p>
      )}
    </div>
  );
};

export default FolderPage;
