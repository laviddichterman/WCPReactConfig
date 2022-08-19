// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ThemeSettings from './components/settings';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import { IsSocketDataLoaded, SocketIoActions } from './redux/slices/SocketIoSlice';
import { useMemo, useEffect } from 'react';
import { toDate as toDateBase } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';


// ----------------------------------------------------------------------

export const CurrentDateAndTzDateFnsUtils = (now: Date | number) =>
  class DateFnsTzUtils extends AdapterDateFns {
    public date = (value?: any) => {
      if (typeof value === "undefined" || value === null) {
        return toDateBase(now);
      }
      return new Date(value);
    };

  }

export default function App() {
  const dispatch = useAppDispatch();
  const socketIoState = useAppSelector((s) => s.ws.status);
  const isSocketDataLoaded = useAppSelector(s => IsSocketDataLoaded(s.ws));
  const currentTime = useAppSelector(s => s.metrics.currentTime);
  const DateAdapter = useMemo(() => CurrentDateAndTzDateFnsUtils(isSocketDataLoaded ? currentTime : Date.now()), [isSocketDataLoaded, currentTime]);
  useEffect(() => {
    if (socketIoState === 'NONE') {
      dispatch(SocketIoActions.startConnection());
    }
  }, [socketIoState, dispatch]);

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <MotionLazyContainer>
        <ThemeProvider>
          <ThemeSettings>
            <NotistackProvider>
              <ProgressBarStyle />
              <ScrollToTop />
              <Router />
            </NotistackProvider>
          </ThemeSettings>
        </ThemeProvider>
      </MotionLazyContainer>
    </LocalizationProvider>
  );
}
