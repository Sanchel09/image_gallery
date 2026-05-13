import React from "react";

export default function PublicSidebar({
  rootSubCategories,
  handleRootSelection,
  selectedFolder,
}) {
  return (
    <aside className="w-72 bg-white/70 backdrop-blur-xl border-r border-gray-200 p-4 flex flex-col gap-2 overflow-y-auto">
      {rootSubCategories.length > 0 &&
        rootSubCategories.map((el) => (
          <div
            key={el.id}
            onClick={() => handleRootSelection(el)}
            className={`px-4 py-3 rounded-lg cursor-pointer font-medium text-sm transition-all duration-200 ${el.name === selectedFolder?.name ? "bg-gray-900 text-white shadow-md" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
          >
            {el.name}
          </div>
        ))}
    </aside>
  );
}
