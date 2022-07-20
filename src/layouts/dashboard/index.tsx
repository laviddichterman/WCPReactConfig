import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Stack } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';

import useResponsive from '../../hooks/useResponsive';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// config
import { HEADER, NAVBAR } from '../../config';
import PACKAGE from '../../../package.json';

//
import Label from '../../components/Label';

import DashboardHeader from './header';
import NavbarVertical from './navbar/NavbarVertical';
import NavbarHorizontal from './navbar/NavbarHorizontal';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { IsSocketDataLoaded, SocketIoActions } from '../../redux/slices/SocketIoSlice';
import { setPageLoadTime, setCurrentTime, TIMING_POLLING_INTERVAL } from '../../redux/slices/TimingSlice';
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

type MainStyleProps = {
  collapseClick: boolean;
};

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})<MainStyleProps>(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const dispatch = useAppDispatch();
  const socketIoState = useAppSelector((s) => s.ws.status);
  const SERVER_TIME = useAppSelector(s=>s.ws.serverTime);
  const PAGE_LOAD_TIME = useAppSelector(s=>s.timing.pageLoadTime);
  const isLoaded = useAppSelector(s=>IsSocketDataLoaded(s.ws));
  const catalog = useAppSelector(s=>s.ws.catalog);

  const { collapseClick, isCollapse } = useCollapseDrawer();

  const { themeLayout } = useSettings();

  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (socketIoState === 'NONE') { 
      dispatch(SocketIoActions.startConnection());
    }
  }, [socketIoState, dispatch]);

  useEffect(() => {
    const checkTiming = () => {
      dispatch(setCurrentTime(Date.now()));
      // TODO: need to add a check how fulfillment is impacted by the change of availability from the new "current time"
      // then we need to check how the cart is impacted by those changes
      // hopefully we can keep all that logic out of here and just update the current time
    }
    checkTiming();
    const interval = setInterval(checkTiming, TIMING_POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [PAGE_LOAD_TIME]);

  useEffect(() => {
    if (PAGE_LOAD_TIME === null && SERVER_TIME !== null){ 
      dispatch(setPageLoadTime(SERVER_TIME));
    }
  }, [PAGE_LOAD_TIME, SERVER_TIME]);

  const verticalLayout = themeLayout === 'vertical';

  if (!isLoaded) {
    return <LoadingScreen />;
  }
  if (verticalLayout) {
    return (
      <>
        <DashboardHeader onOpenSidebar={() => setOpen(true)} verticalLayout={verticalLayout} />

        {isDesktop ? (
          <NavbarHorizontal />
        ) : (
          <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
        )}

        <Box
          component="main"
          sx={{
            px: { lg: 2 },
            pt: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
            },
            pb: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
            },
          }}
        >
          <Outlet />
        </Box>
        <Container>
              <Stack><Typography variant="caption" component="p">WARIO Dashboard Version: <Label>v{PACKAGE.version}</Label></Typography></Stack> 
              {catalog ? <Stack><Typography variant="caption" component="p">WARIO Backend Server Version: <Label>{`v${catalog.api.major}.${catalog.api.minor}.${catalog.api.patch}`}</Label></Typography></Stack> : ""}
          </Container>
      </>
    );
  }

  return (
    <Box
      sx={{
        display: { lg: 'flex' },
        minHeight: { lg: 1 },
      }}
    >
      <DashboardHeader isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />

      <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

      <MainStyle collapseClick={collapseClick}>
        <Outlet />
      </MainStyle>
    </Box>
  );
}
