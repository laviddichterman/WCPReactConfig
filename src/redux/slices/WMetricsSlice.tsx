import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MetricsDto } from "@wcp/wcpshared";
import type { CurrentTimes } from "./ListeningMiddleware";

export const TIMING_POLLING_INTERVAL = 30000;

const initialState: Pick<MetricsDto, 'roughTicksSinceLoad' | 'pageLoadTime' | 'pageLoadTimeLocal' | 'currentTime' | 'currentLocalTime'> = {
  pageLoadTime: 0,
  pageLoadTimeLocal: 0,
  roughTicksSinceLoad: 0,
  currentTime: 0,
  currentLocalTime: 0,
}

const WMetricsSlice = createSlice({
  name: 'metrics',
  initialState: initialState,
  reducers: {
    setPageLoadTime(state, action: PayloadAction<number>) {
      state.pageLoadTime = action.payload;
      state.currentTime = action.payload;
    },
    setPageLoadTimeLocal(state, action: PayloadAction<number>) {
      state.pageLoadTimeLocal = action.payload;
      state.currentLocalTime = action.payload;
    },
    // handled by ListeningMiddleware
    setCurrentTimes(state, action: PayloadAction<CurrentTimes>) {
      const ticks = Math.max(state.roughTicksSinceLoad + TIMING_POLLING_INTERVAL, action.payload.currentLocalTime - state.pageLoadTimeLocal);
      state.currentLocalTime = Math.max(action.payload.currentLocalTime, state.pageLoadTimeLocal + ticks);
      state.currentTime = action.payload.loadTime + ticks;
      state.roughTicksSinceLoad = ticks;
    }
  }
});

export const { 
  setCurrentTimes, 
  setPageLoadTime, 
  setPageLoadTimeLocal } = WMetricsSlice.actions;


export default WMetricsSlice.reducer;
