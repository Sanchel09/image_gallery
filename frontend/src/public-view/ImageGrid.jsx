import { memo } from "react";
import { BACKEND_URL } from "../utils/Constants";

const ImageGrid = ({ images, openModal }) => {
  return (
    <div className="columns-2 sm:columns-4 md:columns-5 lg:columns-6 xl:columns-7 gap-2 space-y-2">
      {images.map((img) => (
        <div
          className="break-inside-avoid mb-2 relative cursor-pointer overflow-hidden rounded-xl shadow hover:shadow-lg transition"
          key={img.id}
        >
          <img
            src={`${BACKEND_URL}/${img.optimized_path}`}
            onClick={() => openModal(img)}
            alt={img.title || "Gallery image"}
            className="w-full object-cover rounded-xl transform hover:scale-105 transition duration-300"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default memo(ImageGrid);
