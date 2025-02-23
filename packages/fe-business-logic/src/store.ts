import { isDevelopment } from '@makefilm/utils';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { moviesReducer } from './slices/movies.slice';

const rootReducer = combineReducers({
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
