//Remaining Task in Public Gallery
//Slideshow
//optimization

import { useState } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import PublicGallery from "./public-view/PublicGallery";
import Login from "./pages/Login";
import CategoryPage from "./pages/CategoryPage";
import SubcategoryPage from "./pages/SubCategoryPage";
import FolderPage from "./pages/FolderPage";
import ImageUploadPage from "./pages/ImageUploadPage";
import ImageGalleryPage from "./pages/ImageGalleryPage";
import DashboardHome from "./components/dashboard/DashboardHome";
import DashboardPage from "./components/dashboard/DashboardPage";

function App() {
  // const isAuthenticated = Boolean(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token")),
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicGallery />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardHome setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          {/* <Route path="/dashboard/*" element={<DashboardHome />}> */}
          <Route index element={<DashboardPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="subcategories" element={<SubcategoryPage />} />
          <Route path="folders" element={<FolderPage />} />
          <Route path="images" element={<ImageUploadPage />} />
          <Route path="gallery" element={<ImageGalleryPage />} />
        </Route>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
