import { m } from 'motion/react';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import { Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { MotionContainer, varBounce } from '../components/animate';
// components
import { Page } from '../components/Page';

// ----------------------------------------------------------------------

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

export default function Page404() {
  return (
    <Page title="404 Page Not Found">
      <Container component={MotionContainer}>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <m.div variants={varBounce("in")}>
            <Typography variant="h3" paragraph>
              Sorry, page not found!
            </Typography>
          </m.div>

          <m.div variants={varBounce("in")}>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL?
              Be sure to check your spelling.
            </Typography>
          </m.div>

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Home
          </Button>
        </ContentStyle>
      </Container>
    </Page>
  );
}
