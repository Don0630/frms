import { Search } from "lucide-react";
export default function DataTable({
  columns = [],
  data = [],
  search,
  setSearch,
  filters,
  rightActions,
  footer,
  emptyText = "No records found",
}) {
  return (
    <div className="w-full space-y-3">

      {/* HEADER */}
      <div className="flex flex-col gap-3">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <div className="flex flex-wrap items-center gap-3 w-full">

            {/* SEARCH */}
            {setSearch && (
              <div className="relative w-full md:w-64">

                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="
                    border rounded-lg pl-9 pr-3 py-2 w-full text-sm
                    bg-white dark:bg-gray-800
                    text-gray-800 dark:text-gray-100
                    border-gray-300 dark:border-gray-700
                    focus:outline-none focus:ring-2 focus:ring-green-500
                  "
                />
              </div>
            )}

            {/* RIGHT ACTIONS */}
            {rightActions && (
              <div className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
                {rightActions}
              </div>
            )}

            {/* FILTERS */}
            {filters && (
              <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                {filters}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="
        w-full overflow-x-auto rounded-lg border
        bg-white dark:bg-gray-900
        border-gray-200 dark:border-gray-800
      ">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="text-left px-3 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="
                    border-t
                    border-gray-200 dark:border-gray-700
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    transition-colors
                  "
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-3 py-2 text-gray-700 dark:text-gray-200"
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>

      {/* FOOTER */}
      {footer && <div>{footer}</div>}

    </div>
  );
}