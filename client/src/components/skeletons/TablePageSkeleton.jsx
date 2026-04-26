import React from "react";

export default function TablePageSkeleton({
  titleWidth = "w-40",
  buttonWidth = "w-28",
  rows = 5,
}) {
  return (
    <div className="w-full p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow animate-pulse border border-gray-200 dark:border-gray-800">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div className={`h-6 ${titleWidth} bg-gray-300 dark:bg-gray-700 rounded`} />
          <div className={`h-9 ${buttonWidth} bg-gray-300 dark:bg-gray-700 rounded`} />
        </div>

        {/* FILTER / CHIPS */}
        <div className="flex gap-3 mb-4">
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>

        {/* TABLE ROWS */}
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"
            />
          ))}
        </div>

      </div>
    </div>
  );
}