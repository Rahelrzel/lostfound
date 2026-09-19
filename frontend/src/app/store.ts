import { configureStore } from '@reduxjs/toolkit';
import genericReducer from '../features/generic/genericSlice';
import reportsReducer from '../features/reports/reportsSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    generic: genericReducer,
    reports: reportsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;