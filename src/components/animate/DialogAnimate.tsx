// @mui
import type { DialogProps } from '@mui/material';

import { AnimatePresence, m } from 'motion/react';

import { Box, Dialog, Paper } from '@mui/material';

//
import { varFade } from './variants';

// ----------------------------------------------------------------------

export interface Props extends DialogProps {
  variants?: Record<string, unknown>;
  onClose?: VoidFunction;
}

export default function DialogAnimate({
  open = false,
  variants,
  onClose,
  children,
  sx,
  ...other
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={open}
          onClose={onClose}
          PaperComponent={(props) => (
            <Box
              component={m.div}
              {...(variants ||
                varFade("inUp", {
                  distance: 120,
                  transitionIn: { duration: 0.32, ease: 'easeOut' },
                  transitionOut: { duration: 0.24, ease: 'easeIn' },
                }))}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                // alignItems: 'center',
                // justifyContent: 'center',
              }}
            >
              <Box onClick={onClose} sx={{ width: '100%', height: '100%', position: 'fixed' }} />
              <Paper sx={sx} {...props}>
                {props.children}
              </Paper>
            </Box>
          )}
          {...other}
        >
          {children}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
