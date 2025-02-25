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
    { key: 'category', label: 'Category', filter: true },
    { key: 'price', label: 'Price' }
  ];

  useEffect(() => {
    dispatch(fetchProducts({
      limit: pageSize,
      skip: (currentPage - 1) * pageSize,
      category: selectedCategory
    }));
  }, [dispatch, pageSize, currentPage, selectedCategory]);

  const filteredData = searchTerm
    ? data.filter((product) =>
      Object.values(product).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    : data;

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
          data={filteredData}
          columns={columns}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageSizeChange={(size) => dispatch(setPageSize(size))}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
          onSearch={(term) => dispatch(setSearchTerm(term))}
          isLoading={loading}
          pageTitle="Products"
        />
      </div>
    </ErrorBoundary>
  );
};

export default Products; 