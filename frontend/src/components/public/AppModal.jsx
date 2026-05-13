import React from "react";

export default function AppModal({ modalOpen, closeModal, currentImage }) {
  return modalOpen && currentImage ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <img
        src={currentImage.original_url || currentImage.original_path}
        alt="Full"
        className="max-h-[90vh] max-w-[90vw] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={closeModal}
        className="absolute top-5 right-5 text-white text-3xl font-bold cursor-pointer"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  ) : null;
}
