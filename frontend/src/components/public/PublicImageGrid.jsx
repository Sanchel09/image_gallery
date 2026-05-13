import React from "react";
import ImageGrid from "../../public-view/ImageGrid";

export default function PublicImageGrid({ images, openModal }) {
  return (
    <section className="flex-1 p-5 flex flex-col min-h-0">
      <div className="mb-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-sm font-medium shadow-md">
        <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
        Total Images: {images.length} images
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <ImageGrid images={images} openModal={openModal} />
      </div>
    </section>
  );
}
