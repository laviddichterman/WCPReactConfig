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
import { IsSocketDataLoaded, SocketIoActions, AdapterCurrentTimeOverrideUtils } from '@wcp/wario-ux-shared';
import { useMemo, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';


// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useAppDispatch();
  const socketIoState = useAppSelector((s) => s.ws.status);
  const isSocketDataLoaded = useAppSelector(s => IsSocketDataLoaded(s.ws));
  const currentTime = useAppSelector(s => s.metrics.currentTime);
  const DateAdapter = useMemo(() => AdapterCurrentTimeOverrideUtils(isSocketDataLoaded ? currentTime : Date.now()), [isSocketDataLoaded, currentTime]);
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
