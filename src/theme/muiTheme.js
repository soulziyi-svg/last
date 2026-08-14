import { createTheme } from '@mui/material/styles';
import { COLORS, FONTS } from './tokens';

const theme = createTheme({
  palette: {
    primary: { main: COLORS.purple },
    secondary: { main: COLORS.pink },
    background: { default: COLORS.white, paper: COLORS.white },
    text: { primary: COLORS.black },
  },
  typography: {
    fontFamily: FONTS.pretendard,
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
