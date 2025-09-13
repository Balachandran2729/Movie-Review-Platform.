import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Initial state
const initialState = {
  profile: null,
  watchlist: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await api.get(`/users/${userId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, userData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await api.put(`/users/${userId}`, userData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update profile');
    }
  }
);

export const fetchWatchlist = createAsyncThunk(
  'user/fetchWatchlist',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await api.get(`/users/${userId}/watchlist`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch watchlist');
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'user/addToWatchlist',
  async ({ userId, movieId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await api.post(`/users/${userId}/watchlist`, { movieId }, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to add to watchlist');
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'user/removeFromWatchlist',
  async ({ userId, movieId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      await api.delete(`/users/${userId}/watchlist/${movieId}`, config);
      return movieId; // Return movieId to identify which item to remove
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to remove from watchlist');
    }
  }
);

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWatchlist: (state) => {
      state.watchlist = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch Watchlist
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.watchlist = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Watchlist
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.watchlist.push(action.payload);
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove from Watchlist
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.watchlist = state.watchlist.filter(
          item => item.movieId._id !== action.payload
        );
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearWatchlist } = userSlice.actions;
export default userSlice.reducer;