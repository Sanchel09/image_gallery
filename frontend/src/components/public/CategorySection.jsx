import React from "react";

export default function CategorySection({ categories, handleCategoryClick }) {
  return (
    <div className="flex flex-wrap justify-center">
      {categories &&
        categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`flex-1 h-screen bg-cover bg-center`}
            style={
              category.imageUrl
                ? { backgroundImage: `url(${category.imageUrl})` }
                : { backgroundColor: "black" }
            }
          >
            <div className="relative group bg-black/40 h-screen flex justify-center items-center text-white cursor-pointer font-semibold text-[6rem] tracking-wide p-10 break-all overflow-hidden border border-white">
              {/* gradient sliding layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-500/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              {/* text */}
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white [writing-mode:vertical-rl] rotate-180">
                {category.name.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
