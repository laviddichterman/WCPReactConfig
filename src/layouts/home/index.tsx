import { Outlet } from 'react-router-dom';
// @mui
import { Box, Container, Stack, Typography } from '@mui/material';
// components
import { Logo } from '../../components/Logo';
//

// ----------------------------------------------------------------------

export function MainLayout() {
  return (
    <Stack sx={{ minHeight: 1 }}>

      <Outlet />

      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{
          py: 5,
          textAlign: 'center',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <Container>
          <Logo sx={{ mb: 1, mx: 'auto' }} />

          <Typography variant="caption" component="p">
            © {new Date().getFullYear()}&nbsp;made by&nbsp;Lavid Industries LLC,<br />released under the GNU General Public License v3
          </Typography>
        </Container>
      </Box>

    </Stack>
  );
}
