import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { novaPostApi } from './services/api/api';
import { calculatorApi } from './services/api/calculatorService';

export const store = configureStore({
  reducer: {
    [novaPostApi.reducerPath]: novaPostApi.reducer,
    [calculatorApi.reducerPath]: calculatorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(novaPostApi.middleware)
      .concat(calculatorApi.middleware), 
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;