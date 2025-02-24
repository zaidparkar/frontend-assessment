import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // Add other fields as needed
}

interface UsersState {
  data: User[];
  loading: boolean;
  error: string | null;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
}

const initialState: UsersState = {
  data: [],
  loading: false,
  error: null,
  pageSize: 5,
  currentPage: 1,
  totalPages: 1,
  searchTerm: ''
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ limit, skip }: { limit: number; skip: number }) => {
    const response = await axios.get(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.users;
        state.totalPages = Math.ceil(action.payload.total / state.pageSize);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { setPageSize, setSearchTerm, setCurrentPage } = usersSlice.actions;
export default usersSlice.reducer; 