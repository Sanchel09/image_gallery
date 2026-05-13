import { useEffect, useState } from "react";
import axios from "../api/axios";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      const res = await axios.post("/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setName("");
      fetchCategories();
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Failed to create category", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Manage Categories
      </h1>

      {/* Create Category Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
        <div className="flex flex-col flex-1">
          <input
            type="text"
            placeholder="New category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-600 border border-gray-300 rounded-xl px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 my-5"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105 disabled:opacity-50 self-start"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </div>

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-64 h-64 object-cover rounded-lg border"
          />
        )}
      </form>

      {/* Categories List */}
      <ul className="space-y-4">
        {categories &&
          categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between bg-white p-4 rounded-2xl shadow hover:shadow-lg transition"
            >
              {/* Left side: image + name */}
              <div className="flex items-center gap-4">
                {category.imageUrl && (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-14 h-14 rounded-xl object-cover border"
                  />
                )}

                <span className="text-gray-800 font-medium">
                  {category.name}
                </span>
              </div>

              {/* Right side: actions */}
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-800 font-medium transition px-3 py-1 rounded-lg hover:bg-red-50"
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
