import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import { api } from "./api";
import cartReducer from "./cartSlice";

function createNoopStorage() {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_unusedKey: string, value: string) {
      void _unusedKey;
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
}

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const cartPersistConfig = {
  key: "mebix-cart",
  storage,
  whitelist: ["items"],
};

const rootReducer = combineReducers({
  cart: persistReducer(cartPersistConfig, cartReducer),
  [api.reducerPath]: api.reducer,
});

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export function makePersistor(store: AppStore) {
  return persistStore(store);
}
