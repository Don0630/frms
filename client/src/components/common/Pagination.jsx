import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  currentItemsLength,
  totalItemsLength,
}) {
  return (
    <div className="flex justify-between items-center mt-2 text-sm text-gray-700 dark:text-gray-300">

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
          className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Prev
        </button>

        {/* PAGE NUMBERS */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded transition-colors ${
              currentPage === i + 1
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}

        {/* NEXT */}
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Next
        </button>

      </div>
    </div>
  );
}