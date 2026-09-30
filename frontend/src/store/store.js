import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import shopReducer from './slices/shopSlice';
import itemReducer from './slices/itemSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    shop: shopReducer,
    item: itemReducer,
  },
});

export default store;
