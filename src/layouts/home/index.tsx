import { useLocation, Outlet } from 'react-router-dom';
// @mui
import { Box, Container, Typography, Stack } from '@mui/material';
// components
import Logo from '../../components/Logo';
//

// ----------------------------------------------------------------------

export default function MainLayout() {
  const { pathname } = useLocation();

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
            © {new Date().getFullYear()}&nbsp;made by&nbsp;Lavid Industries LLC,<br/>released under the GNU General Public License v3
          </Typography>
        </Container>
      </Box>

    </Stack>
  );
}
