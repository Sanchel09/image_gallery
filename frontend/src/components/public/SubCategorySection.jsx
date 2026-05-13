import React from "react";
import { gradients } from "../../utils/Constants";

export default function SubCategorySection({
  rootSubCategories,
  handleRootSelection,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-5">
      {rootSubCategories &&
        rootSubCategories.map((el, idx) => (
          <div
            key={el.id}
            onClick={() => handleRootSelection(el)}
            className={`relative h-28 flex items-end p-4 font-semibold text-gray-900 cursor-pointer transition-all duration-300 rounded-xl border border-white/30 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${gradients[idx % gradients.length]}`}
          >
            {/* Name */}
            <div className="relative z-10 flex flex-col w-full">
              <span className="text-md font-bold tracking-wide">
                {el.name.toUpperCase()}
              </span>

              {/* Image Count Badge */}
              <span
                className="mt-2 self-start px-2 py-0.5 text-[12px] font-medium
                              bg-black/10 text-gray-700 rounded-full backdrop-blur-sm"
              >
                {el.imageCount != null
                  ? `${el.imageCount} images`
                  : `${el.childrenCount > 0 ? el.childrenCount : el.folderCount} folders`}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
