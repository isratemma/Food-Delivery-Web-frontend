import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getShopItemsApi,
  createItemApi,
  getItemByIdApi,
  updateItemApi,
  deleteItemApi,
  toggleItemApi,
} from '../../api/shop.api';

/* ── Thunks ─────────────────────────────────────────────────── */

export const fetchShopItems = createAsyncThunk(
  'item/fetchByShop',
  async ({ shopId, params }, { rejectWithValue }) => {
    try {
      const res = await getShopItemsApi(shopId, params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch items.');
    }
  }
);

export const fetchItemById = createAsyncThunk(
  'item/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await getItemByIdApi(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch item.');
    }
  }
);

export const createItem = createAsyncThunk(
  'item/create',
  async ({ shopId, data }, { rejectWithValue }) => {
    try {
      const res = await createItemApi(shopId, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create item.');
    }
  }
);

export const updateItem = createAsyncThunk(
  'item/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateItemApi(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update item.');
    }
  }
);

export const deleteItem = createAsyncThunk(
  'item/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteItemApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete item.');
    }
  }
);

export const toggleItem = createAsyncThunk(
  'item/toggle',
  async (id, { rejectWithValue }) => {
    try {
      const res = await toggleItemApi(id);
      return { id, isAvailable: res.data.isAvailable };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle item.');
    }
  }
);

/* ── Slice ─────────────────────────────────────────────────── */

const itemSlice = createSlice({
  name: 'item',
  initialState: {
    items:   [],   // items for the currently viewed shop
    current: null, // single item detail
    loading: false,
    error:   null,
  },
  reducers: {
    clearItemError(state)   { state.error   = null; },
    clearCurrentItem(state) { state.current = null; },
    clearItems(state)       { state.items   = []; },
  },
  extraReducers: (builder) => {
    const pending  = (state) => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    // fetchShopItems
    builder
      .addCase(fetchShopItems.pending, pending)
      .addCase(fetchShopItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(fetchShopItems.rejected, rejected);

    // fetchItemById
    builder
      .addCase(fetchItemById.pending, pending)
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchItemById.rejected, rejected);

    // createItem
    builder
      .addCase(createItem.pending, pending)
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, rejected);

    // updateItem
    builder
      .addCase(updateItem.pending, pending)
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items   = state.items.map(i =>
          i._id === action.payload._id ? action.payload : i
        );
        if (state.current?._id === action.payload._id) {
          state.current = action.payload;
        }
      })
      .addCase(updateItem.rejected, rejected);

    // deleteItem
    builder
      .addCase(deleteItem.pending, pending)
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items   = state.items.filter(i => i._id !== action.payload);
      })
      .addCase(deleteItem.rejected, rejected);

    // toggleItem
    builder
      .addCase(toggleItem.pending, pending)
      .addCase(toggleItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items   = state.items.map(i =>
          i._id === action.payload.id
            ? { ...i, isAvailable: action.payload.isAvailable }
            : i
        );
      })
      .addCase(toggleItem.rejected, rejected);
  },
});

export const { clearItemError, clearCurrentItem, clearItems } = itemSlice.actions;

/* ── Selectors ─────────────────────────────────────────────── */
export const selectItems       = (state) => state.item.items;
export const selectCurrentItem = (state) => state.item.current;
export const selectItemLoading = (state) => state.item.loading;
export const selectItemError   = (state) => state.item.error;

export default itemSlice.reducer;
