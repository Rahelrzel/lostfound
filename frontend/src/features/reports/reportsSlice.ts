
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Report } from '../../types';

const MOCK_REPORTS: Report[] = [
  {
    _id: '1',
    title: 'iPhone 13',
    description: 'Black iPhone 13 with a cracked screen protector, lost near the bus stop.',
    type: 'LOST',
    category: 'Phone',
    location: 'Bole',
    date: '2026-09-14',
    imageUrl: 'https://images.unsplash.com/photo-1632582593954-3e5a86042e56?w=600',
    status: 'ACTIVE',
    createdBy: { _id: 'u1', name: 'Selam Tesfaye', phone: '0911223344', email: 'selam@example.com' },
    createdAt: '2026-09-14T09:00:00Z',
  },
  {
    _id: '2',
    title: 'Black Wallet',
    description: 'Leather wallet with ID card and some cash, found on the street.',
    type: 'FOUND',
    category: 'People',
    location: 'Piassa',
    date: '2026-09-15',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',
    status: 'ACTIVE',
    createdBy: { _id: 'u2', name: 'Dawit Bekele', phone: '0922334455', email: 'dawit@example.com' },
    createdAt: '2026-09-15T11:30:00Z',
  },
  {
    _id: '3',
    title: 'Persian Cat',
    description: 'White Persian cat, answers to "Milu", last seen near Kazanchis roundabout.',
    type: 'LOST',
    category: 'Pets',
    location: 'Kazanchis',
    date: '2026-09-16',
    imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600',
    status: 'ACTIVE',
    createdBy: { _id: 'u3', name: 'Hanna Girma', phone: '0933445566', email: 'hanna@example.com' },
    createdAt: '2026-09-16T14:00:00Z',
  },
  {
    _id: '4',
    title: 'Student ID Card',
    description: 'AAU student ID found near the CMC gate, name on card is Yonas M.',
    type: 'FOUND',
    category: 'People',
    location: 'CMC',
    date: '2026-09-17',
    imageUrl: 'https://images.unsplash.com/photo-1606166187734-a4cb74079037?w=600',
    status: 'ACTIVE',
    createdBy: { _id: 'u4', name: 'Yared Alemu', phone: '0944556677', email: 'yared@example.com' },
    createdAt: '2026-09-17T08:15:00Z',
  },
  {
    _id: '5',
    title: 'Toyota Vitz - Silver',
    description: 'Small silver Vitz, plate partially remembered as 3-A12, missing from parking.',
    type: 'LOST',
    category: 'Cars',
    location: 'Megenagna',
    date: '2026-09-12',
    imageUrl: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=600',
    status: 'RESOLVED',
    createdBy: { _id: 'u1', name: 'Selam Tesfaye', phone: '0911223344', email: 'selam@example.com' },
    createdAt: '2026-09-12T07:45:00Z',
  },
  {
    _id: '6',
    title: 'Samsung Galaxy A54',
    description: 'Blue Galaxy A54 found on a minibus, screen has a small crack top-left.',
    type: 'FOUND',
    category: 'Phone',
    location: '4 Kilo',
    date: '2026-09-18',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
    status: 'ACTIVE',
    createdBy: { _id: 'u5', name: 'Meron Tadesse', phone: '0955667788', email: 'meron@example.com' },
    createdAt: '2026-09-18T16:20:00Z',
  },
];

interface ReportsState {
  items: Report[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  items: [],
  loading: false,
  error: null,
};

// Simulated async fetch — swap the resolve() body for an api.ts call once the backend is up.
export const fetchReports = createAsyncThunk('reports/fetchReports', async () => {
  return new Promise<Report[]>((resolve) => {
    setTimeout(() => resolve(MOCK_REPORTS), 400);
  });
});

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    addReport(state, action: PayloadAction<Report>) {
      state.items.unshift(action.payload);
    },
    updateReport(state, action: PayloadAction<Report>) {
      const idx = state.items.findIndex((r) => r._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteReport(state, action: PayloadAction<string>) {
      state.items = state.items.filter((r) => r._id !== action.payload);
    },
    markResolved(state, action: PayloadAction<string>) {
      const report = state.items.find((r) => r._id === action.payload);
      if (report) report.status = 'RESOLVED';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load reports';
      });
  },
});

export const { addReport, updateReport, deleteReport, markResolved } = reportsSlice.actions;
export default reportsSlice.reducer;