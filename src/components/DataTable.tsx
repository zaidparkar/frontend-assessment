import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
  pageTitle: string;
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
  pageTitle
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [debouncedFilters, setDebouncedFilters] = useState<Record<string, string>>({});
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
  const pageSizeOptions = [5, 10, 20, 50];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (JSON.stringify(filters) !== JSON.stringify(debouncedFilters)) {
        setDebouncedFilters(filters);
        if (Object.keys(filters).length > 0 && onFilterChange) {
          const [[key, value]] = Object.entries(filters);
          onFilterChange(key, value);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, debouncedFilters, onFilterChange]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = value ? { [key]: value } : {};
    setFilters(newFilters);

    if (!value && onFilterChange) {
        onFilterChange(key, '');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const toggleFilterDropdown = (key: string) => {
    setActiveFilterDropdown(activeFilterDropdown === key ? null : key);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeFilterDropdown && !(event.target as Element).closest('.filter-dropdown')) {
        setActiveFilterDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeFilterDropdown]);

  return (
    <div className="font-neutra">
      <div className="flex items-center gap-2 mb-6 text-lg">
        <Link to="/" className="text-custom-black/60 hover:text-custom-black">Home</Link>
        <span className="text-custom-black/60">/</span>
        <span className="text-custom-black font-semibold">{pageTitle}</span>
      </div>

      {/* Controls Section */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <div className="relative inline-block">
              <select
                className="appearance-none bg-white w-12 pr-4 pl-2 py-1 focus:outline-none cursor-pointer"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </div>
            </div>
            <span className="ml-3">Entries</span>
          </div>

          <span className="text-custom-black/30">|</span>

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
                className="border border-custom-grey px-4 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-blue transition-all duration-200 placeholder-gray-400"
              />
            )}
          </div>

          <span className="text-custom-black/30">|</span>

          <div className="flex flex-wrap gap-4">
            {columns.filter(col => col.filter).map(column => (
              <div key={column.key} className="relative filter-dropdown">
                <button
                  onClick={() => toggleFilterDropdown(column.key)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border transition-all duration-200
                    ${filters[column.key] ? 'bg-custom-blue border-custom-blueDark' : 'border-custom-grey hover:bg-custom-grey'}
                  `}
                >
                  <FaFilter className="w-3 h-3" />
                  <span>{column.label}</span>
                </button>

                {activeFilterDropdown === column.key && (
                  <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-custom-grey">
                    <div className="p-3">
                      <input
                        type="text"
                        placeholder={`Filter ${column.label}...`}
                        value={filters[column.key] || ''}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                        className="w-full px-3 py-2 border border-custom-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-blue"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
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
                    className="hover:bg-custom-greyDark/20 transition-colors duration-150"
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

        {!isLoading && data.length > 0 && totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
};

export default DataTable; 