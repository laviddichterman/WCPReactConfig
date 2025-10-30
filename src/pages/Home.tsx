// components
import { useAuth0 } from '@auth0/auth0-react';

// @mui
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Page } from '../components/Page';

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
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
  const { loginWithRedirect } = useAuth0();
  return (
    <Page title="Login">
      <RootStyle>
        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="column" alignItems="center" sx={{ mb: 5 }}>
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
