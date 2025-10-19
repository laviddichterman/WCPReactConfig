import { m } from 'motion/react';
import { Link as RouterLink } from 'react-router-dom';

import { styled } from '@mui/material/styles';
// @mui
import { Button, Container, Typography } from '@mui/material';

// components
import { Page } from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';

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

export default function Page403() {
  return (
    <Page title="403 Forbidden">
      <Container component={MotionContainer}>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <m.div variants={varBounce("in")}>
            <Typography variant="h3" paragraph>
              No permission
            </Typography>
          </m.div>

          <m.div variants={varBounce("in")}>
            <Typography sx={{ color: 'text.secondary' }}>
              The page you're trying access has restricted access.
              <br />
              Please refer to your system administrator
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
