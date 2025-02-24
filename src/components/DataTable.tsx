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
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4 bg-white p-4 rounded-lg shadow">
        {/* Left side controls */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              className="bg-custom-grey px-4 py-2 rounded-md appearance-none cursor-pointer pr-8"
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
              className="text-custom-black p-2 hover:bg-custom-grey rounded-full transition-colors"
              title="Search"
            >
              <FaSearch />
            </button>
            {showSearch && (
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                className="border border-custom-grey px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
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
              className="border border-custom-grey px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
            />
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-custom-blue">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-6 py-3 text-left text-custom-black">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-custom-grey">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center">
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-custom-grey/10 transition-colors"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4">
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
        <div className="flex justify-center items-center gap-2 p-4 bg-white border-t border-custom-grey">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 rounded-md transition-colors ${
                currentPage === i + 1 
                  ? 'bg-custom-yellow text-custom-black' 
                  : 'bg-custom-grey hover:bg-custom-grey/80'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataTable; 