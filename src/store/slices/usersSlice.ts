import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
  username: string;
  bloodGroup: string;
  eyeColor: string;
}

interface UsersState {
  data: User[];
  loading: boolean;
  error: string | null;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  filters: Record<string, string>;
}

const initialState: UsersState = {
  data: [],
  loading: false,
  error: null,
  pageSize: 5,
  currentPage: 1,
  totalPages: 1,
  searchTerm: '',
  filters: {}
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ limit, skip, filters }: {
    limit: number;
    skip: number;
    filters?: Record<string, string>;
  }) => {
    let url = 'https://dummyjson.com/users';
    const params = new URLSearchParams();
    params.append('limit', String(limit));

    if (filters && Object.keys(filters).length > 0) {
      url = 'https://dummyjson.com/users/filter';
      const [[key, value]] = Object.entries(filters);
      params.append('key', key);
      params.append('value', value);
      params.append('skip', String(skip));
    } else {
      params.append('skip', String(skip));
    }

    const response = await axios.get(`${url}?${params.toString()}`);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.currentPage = 1;
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

export const { setPageSize, setSearchTerm, setCurrentPage, setFilters } = usersSlice.actions;
export default usersSlice.reducer; 