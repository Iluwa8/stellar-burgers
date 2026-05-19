import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '../../utils/types';
import { RootState } from '../RootReducer';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feeds/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectFeeds = (state: RootState) => state.feeds.orders;
export const selectFeedsTotal = (state: RootState) => state.feeds.total;
export const selectFeedsTotalToday = (state: RootState) =>
  state.feeds.totalToday;
export const selectFeedsLoading = (state: RootState) => state.feeds.isLoading;
export const selectFeedsError = (state: RootState) => state.feeds.error;

export default feedsSlice.reducer;
