import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username: username,
        email: user.email,
        character: null,
      });

      navigate('/profile');
    } catch (err) {
      setError('Hiba történt a regisztráció során!');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, backgroundColor: 'background.paper', textAlign: 'center' }}>
        <Typography variant="h1">Regisztráció</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label="Felhasználónév" 
            fullWidth 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            sx={{ input: { color: 'white' } }}
          />
          <TextField 
            label="Email" 
            fullWidth 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            sx={{ input: { color: 'white' } }}
          />
          <TextField 
            label="Jelszó" 
            type="password" 
            fullWidth 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            sx={{ input: { color: 'white' } }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Regisztráció
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Már van fiókod? <Link to="/login" style={{ color: '#FFD700', fontWeight: 'bold' }}>Lépj be itt!</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
