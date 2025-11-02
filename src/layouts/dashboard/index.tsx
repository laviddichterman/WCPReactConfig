import { withAuthenticationRequired } from '@auth0/auth0-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

// @mui
import { Box, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// hooks
import { IsSocketDataLoaded } from '@wcp/wario-ux-shared';

//
import { Label } from '../../components/Label';
import { LoadingScreen } from '../../components/LoadingScreen';
import { HEADER, NAVBAR } from '../../config';
import { useCollapseDrawer } from '../../hooks/useCollapseDrawer';
import { useAppSelector } from '../../hooks/useRedux';
import { useResponsive } from '../../hooks/useResponsive';
import { useSettings } from '../../hooks/useSettings';

import { DashboardHeader } from './header';
import { NavbarHorizontal } from './navbar/NavbarHorizontal';
import NavbarVertical from './navbar/NavbarVertical';

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
  const isLoaded = useAppSelector(s => IsSocketDataLoaded(s.ws));
  const catalog = useAppSelector(s => s.ws.catalog);

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
        <DashboardHeader onOpenSidebar={() => { setOpen(true); }} verticalLayout={verticalLayout} />

        {isDesktop ? (
          <NavbarHorizontal />
        ) : (
          <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => { setOpen(false); }} />
        )}

        <Box
          component="main"
          sx={{
            px: { md: 2 },
            pt: {
              xs: `${(HEADER.MOBILE_HEIGHT + 24).toString()}px`,
              md: `${(HEADER.DASHBOARD_DESKTOP_HEIGHT + 80).toString()}px`,
            },
            pb: {
              xs: `${(HEADER.MOBILE_HEIGHT + 24).toString()}px`,
              md: `${(HEADER.DASHBOARD_DESKTOP_HEIGHT + 24).toString()}px`,
            },
          }}
        >
          <Outlet />
        </Box>
        <Container>
          <Stack><Typography variant="caption" component="p">WARIO Dashboard Version: <Label>v{__APP_VERSION__}</Label></Typography></Stack>
        </Container>
        {catalog ? <Stack><Typography variant="caption" component="p">WARIO Backend Server Version: <Label>{`v${catalog.api.major.toString()}.${catalog.api.minor.toString()}.${catalog.api.patch.toString()}`}</Label></Typography></Stack> : ""}
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
      <DashboardHeader isCollapse={isCollapse} onOpenSidebar={() => { setOpen(true); }} />

      <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => { setOpen(false); }} />

      <MainStyle collapseClick={collapseClick}>
        <Outlet />
      </MainStyle>
    </Box>
  );
}

export default withAuthenticationRequired(DashboardLayout, { onRedirecting: () => <LoadingScreen /> });