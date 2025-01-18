import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';

import { RootState, StoreProps } from './types/store';
import { isDevelopment } from './utils/environments';

const rootReducer = combineReducers({
  // image: imageReducer,
});

export const createStore = ({ initialState }: StoreProps): Store<RootState> =>
  configureStore({
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
    preloadedState: initialState || {},
    reducer: rootReducer,
  });
