import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/profile'); // Sikeres bejelentkezés után a profil oldalra visz
    } catch (err) {
      setError('Hibás email vagy jelszó!');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, backgroundColor: 'background.paper', textAlign: 'center' }}>
        <Typography variant="h1">Bejelentkezés</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ input: { color: 'white' } }}
          />
          <TextField
            label="Jelszó"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ input: { color: 'white' } }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Bejelentkezés
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Még nincs fiókod? <Link to="/register" style={{ color: '#FFD700', fontWeight: 'bold' }}>Regisztrálj itt!</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
