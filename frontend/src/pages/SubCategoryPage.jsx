import { useEffect, useState } from "react";
import axios from "../api/axios";

const SubcategoryPage = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorySubcategories, setCategorySubcategories] = useState([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [parentSubcategoryId, setParentSubcategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSubcategories = async () => {
    try {
      const res = await axios.get("/subcategories");
      setSubcategories(res.data.data);
    } catch (err) {
      console.error("Failed to fetch subcategories", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !categoryId) return;

    try {
      setLoading(true);
      await axios.post("/subcategories", {
        name,
        categoryId,
        parentId: parentSubcategoryId || null,
      });
      setName("");
      setCategoryId("");
      setParentSubcategoryId("");
      setCategorySubcategories([]);
      fetchSubcategories();
    } catch (err) {
      console.error("Failed to create subcategory", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/subcategories/${id}`);
      fetchSubcategories();
    } catch (err) {
      console.error("Failed to delete subcategory", err);
    }
  };

  const handleCategoryChange = async (e) => {
    const selected = e.target.value;
    setCategoryId(selected);
    setParentSubcategoryId("");
    const res = await axios.post(`/categories/subcategories`, {
      id: selected,
    });
    setCategorySubcategories(res.data.data);
  };

  const renderSubcategoryTree = (nodes, level = 0) => {
    if (!nodes || nodes.length === 0) return null;

    const containerClasses =
      level === 0 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-2";

    return (
      <ul className={containerClasses}>
        {nodes.map((sub) => (
          <li
            key={sub.id}
            className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition relative"
            style={{ marginLeft: level * 24 }}
          >
            <div className="flex justify-between items-start gap-4">
              {/* Subcategory Info */}
              <div>
                <span className="font-semibold text-gray-800">{sub.name}</span>
                <p className="text-sm text-gray-500">
                  Category: {sub.category?.name || "N/A"}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(sub.id)}
                className="text-red-600 hover:text-red-800 font-medium transition"
              >
                Delete
              </button>
            </div>

            {/* Nested Subcategories */}
            {sub.childrenSubCategories &&
              sub.childrenSubCategories.length > 0 && (
                <div className="mt-3">
                  {renderSubcategoryTree(sub.childrenSubCategories, level + 1)}
                </div>
              )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Manage Subcategories
      </h1>

      {/* Form in one row */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 flex flex-col md:flex-row gap-3"
      >
        {/* Subcategory Name */}
        <input
          type="text"
          placeholder="Subcategory name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
        />

        {/* Category Select */}
        <select
          value={categoryId}
          onChange={handleCategoryChange}
          className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
        >
          <option value="">Select category</option>
          {categories &&
            categories.map((cat) => (
              <option value={cat.id} key={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>

      {/* Optional Parent Subcategory Select */}
      {categoryId && (
        <select
          value={parentSubcategoryId}
          onChange={(e) => setParentSubcategoryId(e.target.value)}
          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm mb-4"
        >
          <option value="">Select subcategory (optional)</option>
          {categorySubcategories.length > 0 ? (
            categorySubcategories.map((sub) => (
              <option value={sub.id} key={sub.id}>
                {sub.label}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No subcategories in this category yet
            </option>
          )}
        </select>
      )}

      {/* Subcategory Tree */}
      {subcategories && subcategories.length > 0 ? (
        <div className="space-y-3">{renderSubcategoryTree(subcategories)}</div>
      ) : (
        <p className="text-gray-500 text-center">No subcategories found.</p>
      )}
    </div>
  );
};

export default SubcategoryPage;
