import { type Props } from 'simplebar-react';

import { type SxProps } from '@mui/material';
// @mui
import { type Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface ScrollbarProps extends Props {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}
