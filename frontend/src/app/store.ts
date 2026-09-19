import { configureStore } from "@reduxjs/toolkit";
import genericReducer from "../features/generic/genericSlice";
import reportsReducer from "../features/reports/reportsSlice";

export const store = configureStore({
  reducer: {
    generic: genericReducer,
    reports: reportsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;