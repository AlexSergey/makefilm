import { rest } from '@makefilm/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface Actor {
  id: string;
  name: string;
  type: string[];
}

interface Director {
  id: string;
  name: string;
  type: string[];
}

interface Genre {
  id: string;
  name: string;
}

interface Movie {
  actors: Actor[];
  description: string;
  directors: Director[];
  genres: Genre[];
  id: string;
  thumbnail: string;
  title: string;
  year: number;
}

interface MoviesState {
  error: null | string;
  loading: boolean;
  movies: Movie[];
}

const initialState: MoviesState = {
  error: null,
  loading: false,
  movies: [],
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const response = await rest.get('/movies');

  return response.data.data;
});

const moviesSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      });
  },
  initialState,
  name: 'movies',
  reducers: {},
});

export default moviesSlice.reducer;
