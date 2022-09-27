import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { FulfillmentTime, ResponseSuccess, WOrderInstance, WOrderStatus } from "@wcp/wcpshared";
import axiosInstance from "../../utils/axios";
import uuidv4 from "../../utils/uuidv4";
export const WOrderInstanceAdapter = createEntityAdapter<WOrderInstance>({ selectId: entry => entry.id });
export const { selectAll: getWOrderInstances, selectById: getWOrderInstanceById, selectIds: getWOrderInstanceIds } =
  WOrderInstanceAdapter.getSelectors();

export interface OrderManagerState {
  orders: EntityState<WOrderInstance>;  
  requestStatus: 'FAILED' | 'PENDING' | 'IDLE';
  status: 'NONE' | 'START' | 'CONNECTED' | 'FAILED';
  isLoading: boolean;
  error: Error | string | null;
}

const initialState: OrderManagerState = {
  orders: WOrderInstanceAdapter.getInitialState(),
  requestStatus: 'IDLE',
  status: "NONE",
  isLoading: false,
  error: null,
}

export const pollOpenOrders = createAsyncThunk<WOrderInstance[], string>(
  'orders/pollOpen',
  async (token: string) => {
    const response = await axiosInstance.get('/api/v1/order', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",

      },
      params: { status: WOrderStatus.OPEN },
    });
    return response.data;
  }
);

export const unlockOrders = createAsyncThunk<void, string>(
  'orders/unlock',
  async (token: string) => {
    const response = await axiosInstance.put('/api/v1/order/unlock', {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
    return response.data;
  }
);

export interface ConfirmOrderParams {
  token: string;
  orderId: string;
  additionalMessage: string;
}
export const confirmOrder = createAsyncThunk<ResponseSuccess<WOrderInstance>, ConfirmOrderParams>(
  'orders/confirm',
  async (params: ConfirmOrderParams) => {
    const response = await axiosInstance.put(`/api/v1/order/${params.orderId}/confirm`, {
      additionalMessage: params.additionalMessage
    }, {
      headers: {
        Authorization: `Bearer ${params.token}`,
        "Content-Type": "application/json",
        'Idempotency-Key': uuidv4()
      }
    });
    return response.data;
  }
);

export interface RescheduleOrderParams extends FulfillmentTime {
  token: string;
  orderId: string;
  emailCustomer: boolean;
}
export const rescheduleOrder = createAsyncThunk<ResponseSuccess<WOrderInstance>, RescheduleOrderParams>(
  'orders/reschedule',
  async (params: RescheduleOrderParams) => {
    const response = await axiosInstance.put(`/api/v1/order/${params.orderId}/reschedule`, {
      selectedDate: params.selectedDate,
      selectedTime: params.selectedTime,
      emailCustomer: params.emailCustomer
    }, {
      headers: {
        Authorization: `Bearer ${params.token}`,
        "Content-Type": "application/json",
        'Idempotency-Key': uuidv4()
      },
    });
    return response.data;
  }
);

export interface CancelOrderParams {
  token: string;
  orderId: string;
  reason: string;
  emailCustomer: boolean;
}
export const cancelOrder = createAsyncThunk<ResponseSuccess<WOrderInstance>, CancelOrderParams>(
  'orders/cancel',
  async (params: CancelOrderParams) => {
    const response = await axiosInstance.put(`/api/v1/order/${params.orderId}/cancel`, {
      reason: params.reason,
      emailCustomer: params.emailCustomer
    },
      {
        headers: {
          Authorization: `Bearer ${params.token}`,
          "Content-Type": "application/json",
          'Idempotency-Key': uuidv4()
        }
      });
    return response.data;
  }
);

const OrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    startConnection(state, _: PayloadAction<string>) {
      state.status = 'START';
    },
    setFailed(state) {
      state.status = 'FAILED';
    },
    setConnected(state) {
      state.status = 'CONNECTED';
    },
    receiveOrder(state, action: PayloadAction<WOrderInstance>) {
      WOrderInstanceAdapter.upsertOne(state.orders, action.payload);
    },
    receiveOrders(state, action: PayloadAction<WOrderInstance[]>) {
      WOrderInstanceAdapter.upsertMany(state.orders, action.payload);
    },

    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(pollOpenOrders.fulfilled, (state, action) => {
        WOrderInstanceAdapter.upsertMany(state.orders, action.payload);
        state.requestStatus = 'IDLE';
      })
      .addCase(pollOpenOrders.pending, (state) => {
        state.requestStatus = 'PENDING';
      })
      .addCase(pollOpenOrders.rejected, (state) => {
        state.requestStatus = 'FAILED';
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        WOrderInstanceAdapter.upsertOne(state.orders, action.payload.result!);
        state.requestStatus = 'IDLE';
      })
      .addCase(confirmOrder.pending, (state) => {
        state.requestStatus = 'PENDING';
      })
      .addCase(confirmOrder.rejected, (state) => {
        state.requestStatus = 'FAILED';
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        WOrderInstanceAdapter.upsertOne(state.orders, action.payload.result!);
        state.requestStatus = 'IDLE';
      })
      .addCase(cancelOrder.pending, (state) => {
        state.requestStatus = 'PENDING';
      })
      .addCase(cancelOrder.rejected, (state) => {
        state.requestStatus = 'FAILED';
      })
      .addCase(rescheduleOrder.fulfilled, (state, action) => {
        WOrderInstanceAdapter.upsertOne(state.orders, action.payload.result!);

        state.requestStatus = 'IDLE';
      })
      .addCase(rescheduleOrder.pending, (state) => {
        state.requestStatus = 'PENDING';
      })
      .addCase(rescheduleOrder.rejected, (state) => {
        state.requestStatus = 'FAILED';
      })
      .addCase(unlockOrders.fulfilled, (state) => {
        state.requestStatus = 'IDLE';
      })
      .addCase(unlockOrders.pending, (state) => {
        state.requestStatus = 'PENDING';
      })
      .addCase(unlockOrders.rejected, (state) => {
        state.requestStatus = 'FAILED';
      })
  },
});

export const OrdersActions = OrdersSlice.actions;
export const OrdersReducer = OrdersSlice.reducer;
