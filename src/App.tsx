import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; // Győződj meg róla, hogy a "theme" import helyes
import AppRoutes from './routes'; // Ellenőrizd, hogy a "routes" fájl létezik

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
};

export default App;
