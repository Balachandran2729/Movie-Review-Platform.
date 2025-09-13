import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Initial state
const initialState = {
  movies: [],
  movie: null,
  reviews: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalMovies: 0,
};

// Async thunks
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/movies', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch movies');
    }
  }
);


export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/movies/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch movie');
    }
  }
);

export const fetchReviewsByMovie = createAsyncThunk(
  'movies/fetchReviewsByMovie',
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/movies/${movieId}/reviews`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'movies/createReview',
  async ({ movieId, reviewData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await api.post(`/movies/${movieId}/reviews`, reviewData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to create review');
    }
  }
);

// Update createMovie thunk
export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movieData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await api.post('/movies', movieData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to create movie');
    }
  }
);
// Create slice
const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMovie: (state) => {
      state.movie = null;
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Movies
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.pages;
        state.totalMovies = action.payload.total;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Movie by ID
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.movie = action.payload;
        state.reviews = action.payload.reviews || [];
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Reviews
      .addCase(fetchReviewsByMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Review
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
        // Update movie's average rating if needed
        if (state.movie) {
          state.movie.reviews = [...state.movie.reviews, action.payload];
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMovie } = movieSlice.actions;
export default movieSlice.reducer;