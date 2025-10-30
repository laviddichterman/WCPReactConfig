import { Link as RouterLink } from 'react-router-dom';

// @mui
import { Box, type BoxProps } from '@mui/material';

import { LogoSVG } from '@wcp/wario-ux-shared';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  disabledLink?: boolean;
}

export function Logo({ disabledLink = false, sx, ...other }: Props) {
  const logo = (
    <Box sx={{ width: 40, height: 40, ...sx }} {...other} >
      <LogoSVG />
    </Box>
  );

  return disabledLink ? logo : <RouterLink to="/">{logo}</RouterLink>;
}
