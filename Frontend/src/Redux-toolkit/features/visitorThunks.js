import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authFetch from '../../utils/authFetch.js';  // ✅ DEFAULT IMPORT

// Track page visit
export const trackPageVisit = createAsyncThunk(
  'visitors/trackPageVisit',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch.post('/visitors/track', {});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to track visit');
    }
  }
);

// Get visitor stats
export const getVisitorStats = createAsyncThunk(
  'visitors/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch.get('/visitors/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get stats');
    }
  }
);

// Get today's visitors
export const getTodayVisitors = createAsyncThunk(
  'visitors/getToday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch.get('/visitors/today');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get today\'s visitors');
    }
  }
);

// Visitor Slice
const visitorSlice = createSlice({
  name: 'visitors',
  initialState: {
    totalAllTime: 0,
    todayUnique: 0,
    weeklyData: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(trackPageVisit.pending, (state) => {
        state.loading = true;
      })
      .addCase(trackPageVisit.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.stats) {
          state.totalAllTime = action.payload.stats.totalAllTime;
          state.todayUnique = action.payload.stats.todayUnique;
        }
      })
      .addCase(trackPageVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getVisitorStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVisitorStats.fulfilled, (state, action) => {
        state.loading = false;
        state.totalAllTime = action.payload.totalAllTime || 0;
        state.todayUnique = action.payload.todayUnique || 0;
        state.weeklyData = action.payload.weeklyData || [];
      })
      .addCase(getVisitorStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTodayVisitors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTodayVisitors.fulfilled, (state, action) => {
        state.loading = false;
        state.todayUnique = action.payload.todayUnique || 0;
      })
      .addCase(getTodayVisitors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default visitorSlice.reducer;