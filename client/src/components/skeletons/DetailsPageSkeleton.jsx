import React from "react";

function SkeletonBox({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

export default function DetailsPageSkeleton() {
  return (
    <div className="w-full px-4 space-y-6">
      {/* HEADER CARD */}
      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-6">
        
        {/* Title */}
        <div className="space-y-2">
          <SkeletonBox className="h-8 w-64" />
          <SkeletonBox className="h-4 w-48" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBox className="h-3 w-24" />
              <SkeletonBox className="h-5 w-32" />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700" />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-4 bg-gray-100 dark:bg-gray-800 space-y-2"
            >
              <SkeletonBox className="h-3 w-32" />
              <SkeletonBox className="h-8 w-40" />
            </div>
          ))}
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">
        
        {/* Table Header */}
        <div className="flex justify-between items-center">
          <SkeletonBox className="h-6 w-52" />
          <SkeletonBox className="h-10 w-32" />
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SkeletonBox className="h-10 w-full md:w-72" />

          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonBox key={i} className="h-5 w-20" />
            ))}
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
          {[...Array(4)].map((_, i) => (
            <SkeletonBox key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Table Rows */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-4 py-4 border-b border-gray-100 dark:border-gray-800"
          >
            <SkeletonBox className="h-4 w-32" />
            <SkeletonBox className="h-4 w-28" />
            <SkeletonBox className="h-4 w-24" />
            <SkeletonBox className="h-8 w-20" />
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-between items-center pt-4">
          <SkeletonBox className="h-4 w-32" />

          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <SkeletonBox key={i} className="h-8 w-8 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}