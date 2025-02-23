import { isDevelopment } from '@makefilm/utils';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authReducer } from './slices/auth.slice';
import { moviesReducer } from './slices/movies.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  movies: moviesReducer,
});

export const store = configureStore({
  devTools: isDevelopment(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: true,
      serializableCheck: false,
      thunk: {
        extraArgument: {
          // services,
        },
      },
    }),
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
