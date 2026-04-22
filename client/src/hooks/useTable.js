import { useState, useMemo } from "react";
import useDebounce from "./useDebounce";

export default function useTable({
  data = [],
  searchFields = [],
  filterFn = null,
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  // 🔍 Filter + Search ONLY
  const filteredData = useMemo(() => {
    let result = [...data];

    // search
    if (debouncedSearch) {
      result = result.filter((item) =>
        searchFields.some((field) =>
          String(item[field] || "")
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        )
      );
    }

    // custom filter
    if (filterFn) {
      result = result.filter(filterFn);
    }

    return result;
  }, [data, debouncedSearch, filterFn, searchFields]);

  return {
    search,
    setSearch,
    filteredData,
  };
}