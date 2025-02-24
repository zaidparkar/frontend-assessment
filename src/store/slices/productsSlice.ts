import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  // Add other fields as needed
}

interface ProductsState {
  data: Product[];
  loading: boolean;
  error: string | null;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  selectedCategory: string;
}

const initialState: ProductsState = {
  data: [],
  loading: false,
  error: null,
  pageSize: 5,
  currentPage: 1,
  totalPages: 1,
  searchTerm: '',
  selectedCategory: ''
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ 
    limit, 
    skip, 
    category 
  }: { 
    limit: number; 
    skip: number; 
    category?: string 
  }) => {
    try {
      const baseUrl = 'https://dummyjson.com/products';
      const url = category 
        ? `${baseUrl}/category/${category}?limit=${limit}&skip=${skip}`
        : `${baseUrl}?limit=${limit}&skip=${skip}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const response = await axios.get('https://dummyjson.com/products/categories');
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when changing page size
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset to first page when changing category
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.products;
        state.totalPages = Math.ceil(action.payload.total / state.pageSize);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { 
  setPageSize, 
  setSearchTerm, 
  setCurrentPage, 
  setSelectedCategory 
} = productsSlice.actions;
export default productsSlice.reducer; 