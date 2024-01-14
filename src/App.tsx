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
import { queryPrinterGroups } from './redux/slices/PrinterGroupSlice';
import { useAuth0 } from '@auth0/auth0-react';


/*
 * TODOS:
 *  - limit display of sections / actions depending on user roles
 *  - move API calls to redux (WIP)
 *  - UI product class edit should allow selection of the base
 *  - Add DIRTY check on catalog update fields so we can only send the changed data and make batch/bulk changes easier
 */

// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const socketIoState = useAppSelector((s) => s.ws.status);
  const pgQueryState = useAppSelector((s) => s.printerGroup.requestStatus);
  const isSocketDataLoaded = useAppSelector(s => IsSocketDataLoaded(s.ws));
  const currentTime = useAppSelector(s => s.ws.currentTime);
  const DateAdapter = useMemo(() => AdapterCurrentTimeOverrideUtils(isSocketDataLoaded ? currentTime : Date.now()), [isSocketDataLoaded, currentTime]);
  useEffect(() => {
    if (socketIoState === 'NONE') {
      dispatch(SocketIoActions.startConnection());
    }
  }, [socketIoState, dispatch]);
  useEffect(() => {
    async function init() {
      const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:catalog" } });
      dispatch(queryPrinterGroups(token));
    } 
    if (pgQueryState === 'FAILED' || pgQueryState === 'NONE') {
      init();
    }
  }, [getAccessTokenSilently, dispatch, pgQueryState])
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

