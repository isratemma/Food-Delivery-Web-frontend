import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInApi, signUpApi, signOutApi, googleSignInApi } from '../../api/auth.api';
import api from '../../api/axios';

/* ── Async Thunks ─────────────────────────────────────────── */

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data, { rejectWithValue }) => {
    try {
      const res = await signUpApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Sign up failed.');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (data, { rejectWithValue }) => {
    try {
      const res = await signInApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Sign in failed.');
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await signOutApi();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Sign out failed.');
    }
  }
);

export const googleSignIn = createAsyncThunk(
  'auth/googleSignIn',
  async (data, { rejectWithValue }) => {
    try {
      const res = await googleSignInApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Google sign-in failed.');
    }
  }
);

// Called on app load — rehydrates user from httpOnly cookie
export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch {
      return rejectWithValue(null); // not logged in — silent fail
    }
  }
);

/* ── Slice ────────────────────────────────────────────────── */

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,       // user object from backend
    loading: false,   // request in flight
    error: null,      // error message string
  },
  reducers: {
    // Clear error manually (e.g. when user starts typing)
    clearError(state) {
      state.error = null;
    },
    // Manually set user (e.g. from /me on app load)
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    const pending  = (state) => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    // ── signUp ──
    builder
      .addCase(signUp.pending, pending)
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload;
        state.error   = null;
      })
      .addCase(signUp.rejected, rejected);

    // ── signIn ──
    builder
      .addCase(signIn.pending, pending)
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload;
        state.error   = null;
      })
      .addCase(signIn.rejected, rejected);

    // ── signOut ──
    builder
      .addCase(signOut.pending, pending)
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user    = null;
        state.error   = null;
      })
      .addCase(signOut.rejected, rejected);

    // ── googleSignIn ──
    builder
      .addCase(googleSignIn.pending, pending)
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload;
        state.error   = null;
      })
      .addCase(googleSignIn.rejected, rejected);

    // ── fetchMe (silent rehydrate on app load) ──
    builder
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user    = null; // cookie invalid or absent
      });
  },
});

export const { clearError, setUser } = authSlice.actions;

/* ── Selectors ────────────────────────────────────────────── */
export const selectUser        = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError   = (state) => state.auth.error;
export const selectIsAuth      = (state) => !!state.auth.user;

export default authSlice.reducer;
