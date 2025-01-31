import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', padding: '50px 0' }}>
      <Typography variant="h1">Üdvözöllek a Witchlight Karneválban!</Typography>
      <Typography variant="h2" sx={{ marginBottom: 4 }}>
        Készen állsz egy varázslatos kalandra?
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button component={Link} to="/login" variant="contained" color="primary">
          Bejelentkezés
        </Button>
        <Button component={Link} to="/register" variant="outlined" color="secondary">
          Regisztráció
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
