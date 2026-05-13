import { NavLink, Outlet, useNavigate } from "react-router";
import axios from "../../api/axios";

const DashboardHome = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("/auth/logout", { userId });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-500 to-indigo-600 text-white flex flex-col justify-between p-6 rounded-r-3xl shadow-xl h-screen fixed z-10">
        {/* Logo / Title */}
        <div>
          <h1 className="text-2xl font-bold mb-1">ImageCRM</h1>
          <p className="text-sm opacity-80">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-8 space-y-2 overflow-y-auto">
          {[
            { name: "Dashboard", to: "/dashboard/" },
            { name: "Categories", to: "/dashboard/categories" },
            { name: "Subcategories", to: "/dashboard/subcategories" },
            { name: "Folders", to: "/dashboard/folders" },
            { name: "Upload Images", to: "/dashboard/images" },
            { name: "Gallery", to: "/dashboard/gallery" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard/"} // only exact match for main dashboard
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-white/20 ${
                  isActive ? "bg-white/30 font-semibold" : "text-white/90"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl shadow-md transition transform hover:scale-105 cursor-pointer"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50 ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardHome;
