import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { CreateOrderResponse, FulfillmentTime, WOrderInstance, WOrderStatus } from "@wcp/wcpshared";
import axiosInstance from "../../utils/axios";
import uuidv4 from "../../utils/uuidv4";
export const WOrderInstanceAdapter = createEntityAdapter<WOrderInstance>({ selectId: entry => entry.id });
export const { selectAll: getWOrderInstances, selectById: getWOrderInstanceById, selectIds: getWOrderInstanceIds } =
  WOrderInstanceAdapter.getSelectors();

export interface SocketAuthState {
  orders: EntityState<WOrderInstance>;
  orderToEdit: WOrderInstance | null;
  activeDialog: 'RESCHEDULE' | 'CANCEL' | null;
  requestStatus: 'FAILED' | 'PENDING' | 'IDLE';
  status: 'NONE' | 'START' | 'CONNECTED' | 'FAILED';
}

const initialState: SocketAuthState = {
  orders: WOrderInstanceAdapter.getInitialState(),
  orderToEdit: null,
  activeDialog: null,
  requestStatus: 'IDLE',
  status: "NONE"
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

export interface ConfirmOrderParams {
  token: string;
  orderId: string;
  additionalMessage: string;
}
export const confirmOrder = createAsyncThunk<CreateOrderResponse, ConfirmOrderParams>(
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
export const rescheduleOrder = createAsyncThunk<CreateOrderResponse, RescheduleOrderParams>(
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
export const cancelOrder = createAsyncThunk<CreateOrderResponse, CancelOrderParams>(
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

const SocketAuthSlice = createSlice({
  name: 'wsAuth',
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
    closeDialog(state) {
      state.activeDialog = null;
      state.orderToEdit = null;
    },
    setOrderForReschedule(state, action: PayloadAction<WOrderInstance>) {
      state.orderToEdit = action.payload;
      state.activeDialog = 'RESCHEDULE';
    },
    setOrderForCancel(state, action: PayloadAction<WOrderInstance>) {
      state.orderToEdit = action.payload;
      state.activeDialog = 'CANCEL';
    }
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
        state.activeDialog = null;
        state.orderToEdit = null;
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
        state.activeDialog = null;
        state.orderToEdit = null;
        state.requestStatus = 'IDLE';
      })
      .addCase(rescheduleOrder.pending, (state) => {
        state.requestStatus = 'PENDING';
      })
      .addCase(rescheduleOrder.rejected, (state) => {
        state.requestStatus = 'FAILED';
      })
  },
});

export const SocketAuthActions = SocketAuthSlice.actions;
export const SocketAuthReducer = SocketAuthSlice.reducer;
