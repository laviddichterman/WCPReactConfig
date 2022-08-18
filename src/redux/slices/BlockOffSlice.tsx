import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const TIMING_POLLING_INTERVAL = 30000;

export interface BlockOffState {
  selectedServices: string[];
  selectedDate: string | null;
  startTime: number | null;
  endTime: number | null;
}

const initialState: BlockOffState = {
  selectedServices: [],
  selectedDate: null,
  startTime: null,
  endTime: null
}

const BlockOffSlice = createSlice({
  name: 'blockOff',
  initialState: initialState,
  reducers: {
    setSelectedServices(state, action: PayloadAction<string[]>) {
      state.selectedServices = action.payload;
    },
    toggleSelectedService(state, action: PayloadAction<string>) {
      const loc = state.selectedServices.indexOf(action.payload);
      if (loc === -1) {
        state.selectedServices = [...state.selectedServices, action.payload];
      } else {
        state.selectedServices.splice(loc, 1);
      }
    },
    setSelectedDate(state, action: PayloadAction<string | null>) {
      state.selectedDate = action.payload;
    },
    setStartTime(state, action: PayloadAction<number | null>) {
      state.startTime = action.payload;
    },
    setEndTime(state, action: PayloadAction<number | null>) {
      state.endTime = action.payload;
    }
  }
});

export const { setEndTime, setSelectedDate, setSelectedServices, setStartTime, toggleSelectedService } = BlockOffSlice.actions;


export default BlockOffSlice.reducer;
