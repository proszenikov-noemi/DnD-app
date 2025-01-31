import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D81B60', // Élénk rózsaszín-vörös (cirkuszi főszín)
    },
    secondary: {
      main: '#FFD700', // Arany, kiemelt elemekhez
    },
    background: {
      default: '#2C3E50', // Mélykék háttér (elegáns és cirkuszi)
      paper: '#34495E', // Kártyákhoz, kissé világosabb háttér
    },
    text: {
      primary: '#FFFFFF', // Fehér szöveg
      secondary: '#FFD700', // Arany kiemelések
    },
  },
  typography: {
    fontFamily: `'Poppins', sans-serif`, // Modern és mesés betűtípus
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#FFD700', // Arany címek
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#FFFFFF', // Fehér alcímek
    },
    body1: {
      fontSize: '1rem',
      color: '#EDEDED', // Lágyabb fehér szöveg
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // Szebb, lekerekített gombok
          textTransform: 'none', // Normál szövegformázás
          padding: '10px 20px',
          fontSize: '1rem',
        },
      },
    },
  },
});

export default theme;
