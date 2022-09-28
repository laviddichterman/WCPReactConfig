import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { PrinterGroup } from "@wcp/wcpshared";
import axiosInstance from "../../utils/axios";
export const PrinterGroupAdapter = createEntityAdapter<PrinterGroup>({ selectId: entry => entry.id });
export const { selectAll: getPrinterGroups, selectById: getPrinterGroupById, selectIds: getPrinterGroupIds } =
PrinterGroupAdapter.getSelectors();

export interface OrderManagerState {
  printerGroups: EntityState<PrinterGroup>;  
  requestStatus: 'FAILED' | 'PENDING' | 'IDLE';
}

const initialState: OrderManagerState = {
  printerGroups: PrinterGroupAdapter.getInitialState(),
  requestStatus: "IDLE"
}

export const queryPrinterGroups = createAsyncThunk<PrinterGroup[], string>(
  'printerGroup/init',
  async (token: string) => {
    const response = await axiosInstance.get('/api/v1/menu/printergroup', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    return response.data;
  }
);

const PrinterGroupSlice = createSlice({
  name: 'printerGroup',
  initialState,
  reducers: {
    receivePrinterGroups(state, action: PayloadAction<PrinterGroup[]>) {
      PrinterGroupAdapter.upsertMany(state.printerGroups, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(queryPrinterGroups.fulfilled, (state, action) => {
        PrinterGroupAdapter.upsertMany(state.printerGroups, action.payload);
        state.requestStatus = 'IDLE';
      })
      .addCase(queryPrinterGroups.pending, (state) => {
        state.requestStatus = 'PENDING';
      })
      .addCase(queryPrinterGroups.rejected, (state) => {
        state.requestStatus = 'FAILED';
      })
  },
});

export const PrinterGroupActions = PrinterGroupSlice.actions;
export const PrinterGroupReducer = PrinterGroupSlice.reducer;
