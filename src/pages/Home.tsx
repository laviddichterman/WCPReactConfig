// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Alert, Tooltip, Container, Typography, Button } from '@mui/material';
import useResponsive from '../hooks/useResponsive';

import Logo from '../components/Logo';
// components
import Page from '../components/Page';
import { useAuth0 } from '@auth0/auth0-react';

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));
const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function HomePage() {
  const mdUp = useResponsive('up', 'md');
  const { loginWithRedirect } = useAuth0();
  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Sign in to WARIO
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Button
                  onClick={() => loginWithRedirect()}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Login
                </Button>
              </Box>
            </Stack>

          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
