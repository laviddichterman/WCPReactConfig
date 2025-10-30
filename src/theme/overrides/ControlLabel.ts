import { type Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function ControlLabel(theme: Theme) {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          ...theme.typography.body2
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: theme.spacing(1)
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.disabled
        }
      }
    }
  };
}
