import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchProducts, setPageSize, setSearchTerm, setCurrentPage, setSelectedCategory } from '../store/slices/productsSlice';
import DataTable from '../components/DataTable';
import ErrorBoundary from '../components/ErrorBoundary';

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, pageSize, currentPage, totalPages, searchTerm, selectedCategory } = useSelector((state: RootState) => state.products);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title', filter: true },
    { key: 'description', label: 'Description' },
    { key: 'brand', label: 'Brand', filter: true },
    { 
      key: 'category', 
      label: 'Category', 
      filter: true,
      filterType: 'dropdown' as const,
      options: ['ALL', 'Laptops']
    },
    { key: 'price', label: 'Price' }
  ];

  useEffect(() => {
    dispatch(fetchProducts({
      limit: pageSize,
      skip: (currentPage - 1) * pageSize,
      category: selectedCategory,
      searchTerm: searchTerm
    }));
  }, [dispatch, pageSize, currentPage, selectedCategory, searchTerm]);

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'category') {
      dispatch(setSelectedCategory(value));
    } else {
      dispatch(setSearchTerm(value));
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        <DataTable
          data={data}
          columns={columns}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageSizeChange={(size) => dispatch(setPageSize(size))}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
          onSearch={(term) => dispatch(setSearchTerm(term))}
          onFilterChange={handleFilterChange}
          isLoading={loading}
          pageTitle="Products"
        />
      </div>
    </ErrorBoundary>
  );
};

export default Products; 