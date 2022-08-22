import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export const TIMING_POLLING_INTERVAL = 30000;

export interface TimeOption {
  value: number;
  disabled: boolean;
};

export interface BlockOffState {
  startOptions: TimeOption[];
  endOptions: TimeOption[];
  selectedServices: string[];
  selectedDate: string | null;
  startTime: number | null;
  endTime: number | null;
}

const initialState: BlockOffState = {
  startOptions: [],
  endOptions: [],
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
    },
    setStartOptions(state, action: PayloadAction<TimeOption[]>) {
      state.startOptions = action.payload;
    },
    setEndOptions(state, action: PayloadAction<TimeOption[]>) {
      state.endOptions = action.payload;
    },
    
  }
});

export const { setEndTime, setSelectedDate, setSelectedServices, setStartTime, toggleSelectedService, setStartOptions, setEndOptions } = BlockOffSlice.actions;


export default BlockOffSlice.reducer;
