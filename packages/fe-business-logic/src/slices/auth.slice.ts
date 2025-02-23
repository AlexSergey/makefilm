import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rest } from '../utils/rest';

export interface AuthState {
  accessToken: null | string;
  error: null | string;
  refreshToken: null | string;
  status: 'failed' | 'idle' | 'loading' | 'succeeded';
}

const initialState: AuthState = {
  accessToken: null,
  error: null,
  refreshToken: null,
  status: 'idle',
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ password, username }: { password: string; username: string }) => {
    const response = await rest.post('/api/auth/register', { password, username });

    return response.data;
  },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ password, username }: { password: string; username: string }) => {
    const response = await rest.post('/api/auth/login', { password, username });

    return response.data;
  },
);

export const refreshAccessToken = createAsyncThunk('auth/refresh', async (refreshToken: string) => {
  const response = await rest.post('/api/auth/refresh', { refreshToken });

  return response.data;
});

const authSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.status = 'succeeded';
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.status = 'succeeded';
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state) => {
          state.status = 'failed';
          // state.error = action.error.message || 'Something went wrong';
          state.error = 'Something went wrong';
        },
      );
  },
  initialState,
  name: 'auth',
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
