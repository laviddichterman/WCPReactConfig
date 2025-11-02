import { forwardRef, type ReactNode } from 'react';

// @mui
import { Box, type BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  children: ReactNode;
  meta?: ReactNode;
  title: string;
}
export const Page = forwardRef<HTMLDivElement, Props>(({ children, title = '', meta, ...other }, ref) => (
  <>
    <title>{`${title} | WARIO Backend`}</title>
    {meta}

    <Box ref={ref} {...other}>
      {children}
    </Box>
  </>
));
