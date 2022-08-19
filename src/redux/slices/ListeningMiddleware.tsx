import { createListenerMiddleware, addListener, ListenerEffectAPI } from '@reduxjs/toolkit'
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit'
import { RootState, AppDispatch } from '../store'
import { SocketIoActions } from './SocketIoSlice';
import { setCurrentTimes, setPageLoadTime, setPageLoadTimeLocal, TIMING_POLLING_INTERVAL } from './WMetricsSlice';
import { parseISO } from 'date-fns';


export const ListeningMiddleware = createListenerMiddleware()

export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export const startAppListening = ListeningMiddleware.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>;

export interface CurrentTimes {
  loadTime: number;
  currentLocalTime: number;
}
const computeCurrentTimes = (timeString: string) => { 
  return { loadTime: parseISO(timeString).valueOf(),
    currentLocalTime: Date.now()
  }
}

ListeningMiddleware.startListening({
  actionCreator: SocketIoActions.receiveServerTime,
  effect: (action: ReturnType<typeof SocketIoActions.receiveServerTime>, api: ListenerEffectAPI<RootState, AppDispatch>) => {
    if (api.getOriginalState().metrics.pageLoadTime === 0) {
      const serverTimeString = action.payload.time;

      const dt = parseISO(action.payload.time);
      const localDate = new Date();
      api.dispatch(setPageLoadTime(dt.valueOf()));
      api.dispatch(setPageLoadTimeLocal(localDate.valueOf()));
      const checkTiming = () => {
        api.dispatch(setCurrentTimes(computeCurrentTimes(serverTimeString)));
      }
      setInterval(checkTiming, TIMING_POLLING_INTERVAL);
    }
    //return () => clearInterval(interval);    
  }
});


export default ListeningMiddleware;