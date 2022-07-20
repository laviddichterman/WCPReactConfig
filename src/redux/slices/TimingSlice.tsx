import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const TIMING_POLLING_INTERVAL = 30000;

export interface TimingState { 
  pageLoadTime: number | null;
  roughTicksSinceLoad: number;
  currentTime: number | null;
}

const initialState: TimingState = {
  pageLoadTime: null,
  roughTicksSinceLoad: 0,
  currentTime: null
}

const TimingSlice = createSlice({
  name: 'timing',
  initialState,
  reducers: {
    setPageLoadTime(state, action: PayloadAction<number>) {
      if (state.pageLoadTime === null) {
        state.pageLoadTime = action.payload;
      }
    },
    setCurrentTime(state, action: PayloadAction<number>) {
      let ticks = state.roughTicksSinceLoad + TIMING_POLLING_INTERVAL;
      let time = action.payload;
      if (state.pageLoadTime !== null) {
        ticks = Math.max(ticks, action.payload - state.pageLoadTime);
        time = Math.max(time, state.pageLoadTime + ticks);
      }
      state.currentTime = time;
      state.roughTicksSinceLoad = ticks;
    },
  }
});


export const { setPageLoadTime, setCurrentTime } = TimingSlice.actions;

export default TimingSlice.reducer;
