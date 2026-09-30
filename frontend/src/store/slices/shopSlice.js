import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllShopsApi,
  getShopByIdApi,
  getMyShopApi,
  createShopApi,
  updateShopApi,
  deleteShopApi,
  toggleShopApi,
} from '../../api/shop.api';

/* ── Thunks ─────────────────────────────────────────────────── */

export const fetchAllShops = createAsyncThunk(
  'shop/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await getAllShopsApi(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch shops.');
    }
  }
);

export const fetchShopById = createAsyncThunk(
  'shop/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await getShopByIdApi(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch shop.');
    }
  }
);

export const fetchMyShop = createAsyncThunk(
  'shop/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyShopApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch your shop.');
    }
  }
);

export const createShop = createAsyncThunk(
  'shop/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createShopApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create shop.');
    }
  }
);

export const updateShop = createAsyncThunk(
  'shop/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateShopApi(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update shop.');
    }
  }
);

export const deleteShop = createAsyncThunk(
  'shop/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteShopApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete shop.');
    }
  }
);

export const toggleShop = createAsyncThunk(
  'shop/toggle',
  async (id, { rejectWithValue }) => {
    try {
      const res = await toggleShopApi(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle shop.');
    }
  }
);

/* ── Slice ─────────────────────────────────────────────────── */

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    shops:      [],    // list from getAllShops
    total:      0,
    pages:      1,
    page:       1,
    current:    null,  // single shop detail
    myShop:     null,  // logged-in owner's shop
    loading:    false,
    error:      null,
  },
  reducers: {
    clearShopError(state) { state.error = null; },
    clearCurrentShop(state) { state.current = null; },
  },
  extraReducers: (builder) => {
    const pending  = (state) => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    // fetchAllShops
    builder
      .addCase(fetchAllShops.pending, pending)
      .addCase(fetchAllShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops   = action.payload.shops;
        state.total   = action.payload.total;
        state.pages   = action.payload.pages;
        state.page    = action.payload.page;
      })
      .addCase(fetchAllShops.rejected, rejected);

    // fetchShopById
    builder
      .addCase(fetchShopById.pending, pending)
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchShopById.rejected, rejected);

    // fetchMyShop
    builder
      .addCase(fetchMyShop.pending, pending)
      .addCase(fetchMyShop.fulfilled, (state, action) => {
        state.loading = false;
        state.myShop  = action.payload;
      })
      .addCase(fetchMyShop.rejected, rejected);

    // createShop
    builder
      .addCase(createShop.pending, pending)
      .addCase(createShop.fulfilled, (state, action) => {
        state.loading = false;
        state.myShop  = action.payload;
        state.shops.unshift(action.payload);
      })
      .addCase(createShop.rejected, rejected);

    // updateShop
    builder
      .addCase(updateShop.pending, pending)
      .addCase(updateShop.fulfilled, (state, action) => {
        state.loading = false;
        state.myShop  = action.payload;
        state.shops   = state.shops.map(s =>
          s._id === action.payload._id ? action.payload : s
        );
        if (state.current?._id === action.payload._id) {
          state.current = action.payload;
        }
      })
      .addCase(updateShop.rejected, rejected);

    // deleteShop
    builder
      .addCase(deleteShop.pending, pending)
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.loading = false;
        state.myShop  = null;
        state.shops   = state.shops.filter(s => s._id !== action.payload);
      })
      .addCase(deleteShop.rejected, rejected);

    // toggleShop
    builder
      .addCase(toggleShop.pending, pending)
      .addCase(toggleShop.fulfilled, (state, action) => {
        state.loading = false;
        if (state.myShop) state.myShop.isOpen = action.payload.isOpen;
      })
      .addCase(toggleShop.rejected, rejected);
  },
});

export const { clearShopError, clearCurrentShop } = shopSlice.actions;

/* ── Selectors ─────────────────────────────────────────────── */
export const selectShops       = (state) => state.shop.shops;
export const selectShopTotal   = (state) => state.shop.total;
export const selectShopPages   = (state) => state.shop.pages;
export const selectCurrentShop = (state) => state.shop.current;
export const selectMyShop      = (state) => state.shop.myShop;
export const selectShopLoading = (state) => state.shop.loading;
export const selectShopError   = (state) => state.shop.error;

export default shopSlice.reducer;
