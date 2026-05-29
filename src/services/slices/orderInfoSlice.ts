import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { RootState } from '../RootReducer';

type TOrderInfoState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  order: null,
  isLoading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderInfo/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);
      if (!data?.success || !data.orders?.[0]) {
        return rejectWithValue('Заказ не найден');
      }
      return data.orders[0];
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo: (state) => {
      state.order = null;
      state.error = null;
    },
    setOrderFromCache: (state, action: PayloadAction<TOrder>) => {
      state.order = action.payload;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrderInfo, setOrderFromCache } = orderInfoSlice.actions;
export const selectOrderInfo = (state: RootState) => state.orderInfo.order;
export const selectOrderInfoLoading = (state: RootState) =>
  state.orderInfo.isLoading;
export const selectOrderInfoError = (state: RootState) => state.orderInfo.error;

export default orderInfoSlice.reducer;
