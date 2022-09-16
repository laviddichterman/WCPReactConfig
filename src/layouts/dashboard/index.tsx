import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Stack } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import { IsSocketDataLoaded } from '@wcp/wario-ux-shared';

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
import { useAppSelector } from '../../hooks/useRedux';
import LoadingScreen from '../../components/LoadingScreen';
import { withAuthenticationRequired } from '@auth0/auth0-react';

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
  [theme.breakpoints.up('md')]: {
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

function DashboardLayout() {
  const isLoaded = useAppSelector(s=>IsSocketDataLoaded(s.ws));
  const catalog = useAppSelector(s=>s.ws.catalog);

  const { collapseClick, isCollapse } = useCollapseDrawer();

  const { themeLayout } = useSettings();

  const isDesktop = useResponsive('up', 'md');

  const [open, setOpen] = useState(false);

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
            px: { md: 2 },
            pt: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              md: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
            },
            pb: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              md: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
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
        display: { md: 'flex' },
        minHeight: { md: 1 },
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

export default withAuthenticationRequired(DashboardLayout, { onRedirecting: () =><LoadingScreen />});