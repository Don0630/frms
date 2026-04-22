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

        {/* TOP ROW: SEARCH + FILTERS */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          {/* LEFT SIDE */}
          <div className="flex flex-wrap items-center gap-3 w-full">

            {/* SEARCH */}
            {setSearch && (
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="border rounded-lg px-3 py-2 bg-white w-full md:w-64 text-sm"
              />
            )}

            {/* RADIO FILTERS (rightActions used here) */}
            {rightActions && (
              <div className="flex items-center gap-4 text-sm flex-nowrap">
                {rightActions}
              </div>
            )}

            {/* EXTRA FILTERS (optional) */}
            {filters && (
              <div className="flex items-center gap-3 text-sm">
                {filters}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto border rounded-lg bg-white">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600">
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
                  className="text-center py-6 text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">

                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2">
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