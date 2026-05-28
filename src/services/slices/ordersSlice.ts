import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../RootReducer';

type TOrderState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectUserOrders = (state: RootState) => state.orders.orders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.orders.isLoading;
export const selectUserOrdersError = (state: RootState) => state.orders.error;

export default ordersSlice.reducer;
