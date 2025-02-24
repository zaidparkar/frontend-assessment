import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface Column {
  key: string;
  label: string;
  filter?: boolean;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  pageSize: number;
  currentPage: number;
  totalPages: number;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onFilterChange?: (key: string, value: string) => void;
  isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  pageSize,
  currentPage,
  totalPages,
  onPageSizeChange,
  onPageChange,
  onSearch,
  onFilterChange,
  isLoading = false,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const pageSizeOptions = [5, 10, 20, 50];

  const handleFilterChange = (key: string, value: string) => {
    // Reset other filters when one is changed
    const newFilters = { [key]: value };
    setFilters(newFilters);

    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="font-neutra">
      {/* Controls Section */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 bg-white p-6 rounded-xl shadow-lg">
        {/* Left side controls */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              className="bg-custom-grey px-4 py-2.5 rounded-lg appearance-none cursor-pointer pr-10 hover:bg-custom-grey/80 transition-colors focus:outline-none focus:ring-2 focus:ring-custom-blue"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size} items
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-custom-black p-2.5 hover:bg-custom-grey rounded-lg transition-all duration-200 hover:shadow-md"
              title="Search"
            >
              <FaSearch className="w-4 h-4" />
            </button>
            {showSearch && (
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                className="border border-custom-grey px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-blue transition-all duration-200 placeholder-gray-400"
              />
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap gap-4">
          {columns.filter(col => col.filter).map(column => (
            <input
              key={column.key}
              type="text"
              placeholder={`Filter ${column.label}...`}
              value={filters[column.key] || ''}
              onChange={(e) => handleFilterChange(column.key, e.target.value)}
              className="border border-custom-grey px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-blue transition-all duration-200 placeholder-gray-400"
            />
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-custom-blue">
                {columns.map((column) => (
                  <th key={column.key} className="px-6 py-4 text-left text-custom-black font-semibold">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-custom-grey/30">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-custom-blue border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-custom-grey/5 transition-colors duration-150"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 text-custom-black/90">
                        {row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex justify-center items-center gap-2 p-6 bg-white border-t border-custom-grey/30">
          {(() => {
            const pages = [];
            const maxVisiblePages = 5;

            pages.push(1);

            if (currentPage > maxVisiblePages - 1) {
              pages.push('...');
            }

            for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
              if (!pages.includes(i)) {
                pages.push(i);
              }
            }

            if (currentPage < totalPages - (maxVisiblePages - 2)) {
              pages.push('...');
            }

            pages.push(totalPages);

            return pages.map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => onPageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${currentPage === page
                      ? 'bg-custom-yellow text-custom-black shadow-md'
                      : 'bg-custom-grey hover:bg-custom-grey/80 hover:shadow-md'
                    }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="px-2">
                  {page}
                </span>
              )
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default DataTable; 