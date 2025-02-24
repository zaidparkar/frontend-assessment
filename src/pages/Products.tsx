import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { 
  fetchProducts, 
  fetchCategories,
  setPageSize, 
  setSearchTerm, 
  setCurrentPage,
  setSelectedCategory 
} from '../store/slices/productsSlice';
import DataTable from '../components/DataTable';
import ErrorBoundary from '../components/ErrorBoundary';

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    data, 
    loading, 
    error,
    pageSize, 
    currentPage, 
    totalPages, 
    searchTerm,
    selectedCategory 
  } = useSelector((state: RootState) => state.products);
  const [categories, setCategories] = useState<string[]>([]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title', filter: true },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price', filter: true },
    { key: 'brand', label: 'Brand', filter: true },
    { key: 'category', label: 'Category' },
    { key: 'stock', label: 'Stock' },
    { key: 'rating', label: 'Rating' }
  ];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await dispatch(fetchCategories()).unwrap();
        setCategories(response);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, [dispatch]);

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-neutra">Products</h1>
          <select
            className="bg-custom-grey px-4 py-2 rounded-md"
            value={selectedCategory}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

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
        />
      </div>
    </ErrorBoundary>
  );
};

export default Products; 