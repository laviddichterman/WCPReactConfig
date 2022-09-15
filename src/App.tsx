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

/*
 * TODOS:
 *  - IDEA: API types should encapsulate the business logic, eg: createProduct should take a list of product instances or maybe at least one product instance that'll serve as the base product (most common case) 
 *  - switch to login with redirect
 *  - implement authorization with redux https://community.auth0.com/t/how-which-library-to-use-for-react-redux/55854
 *  - limit display of sections / actions depending on user roles
 *  - move API calls to redux
 *  - add notistack toasters for API call fail/success (WIP)
 *  - add orders dashboard
 *  - UI product class edit should allow selection of the base
 */

// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useAppDispatch();
  const socketIoState = useAppSelector((s) => s.ws.status);
  const isSocketDataLoaded = useAppSelector(s => IsSocketDataLoaded(s.ws));
  const currentTime = useAppSelector(s => s.ws.currentTime);
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
