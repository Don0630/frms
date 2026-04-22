import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  currentItemsLength,
  totalItemsLength,
}) {
  return (
    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">

      {/* INFO */}
      <span>
        Showing {currentItemsLength} of {totalItemsLength} records
      </span>

      {/* BUTTONS */}
      <div className="flex gap-2">

        {/* PREV */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {/* PAGE NUMBERS */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        {/* NEXT */}
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}