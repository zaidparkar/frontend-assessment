import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import productsReducer from './slices/productsSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 