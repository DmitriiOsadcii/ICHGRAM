import { configureStore } from "@reduxjs/toolkit";
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import rootReducer from "./rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, REGISTER, PURGE, REHYDRATE],
      },
    }),
});

export const persistor = persistStore(store);

// === ТИПЫ — ПОСЛЕ store ===
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;