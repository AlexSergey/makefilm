import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';

import moviesReducer from './store/movies.slice';
import { isDevelopment } from './utils/environments';

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
