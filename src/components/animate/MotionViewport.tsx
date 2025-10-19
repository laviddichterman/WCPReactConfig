// @mui
import type { BoxProps } from '@mui/material';
import type { MotionProps } from 'motion/react';

import { m } from 'motion/react';

import { Box } from '@mui/material';

//
import { varContainer } from './variants';
// hooks
import { useResponsive } from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

type IProps = BoxProps & MotionProps;

interface Props extends IProps {
  children: React.ReactNode;
  disableAnimatedMobile?: boolean;
}

export default function MotionViewport({
  children,
  disableAnimatedMobile = true,
  ...other
}: Props) {
  const isMobile = useResponsive('down', 'sm');

  if (isMobile && disableAnimatedMobile) {
    return <Box {...other}>{children}</Box>;
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  );
}
