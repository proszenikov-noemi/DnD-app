import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
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
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url('/HomePageBackground.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Átlátszó sötét háttér
          borderRadius: "15px",
          padding: "30px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.8)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#ffffff",
            fontFamily: "'MedievalSharp', serif",
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
            marginBottom: 4,
          }}
        >
          Regisztráció
        </Typography>
        {error && (
          <Typography color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleRegister}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Felhasználónév"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: "5px",
              },
              "& .MuiInputLabel-root": {
                color: "#aaa",
              },
            }}
          />
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: "5px",
              },
              "& .MuiInputLabel-root": {
                color: "#aaa",
              },
            }}
          />
          <TextField
            label="Jelszó"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: "5px",
              },
              "& .MuiInputLabel-root": {
                color: "#aaa",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#f4a261",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
              "&:hover": { backgroundColor: "#e76f51" },
            }}
          >
            Regisztráció
          </Button>
        </Box>
        <Typography
          variant="body2"
          align="center"
          sx={{
            marginTop: 3,
            color: "#ffffff",
            fontFamily: "'MedievalSharp', serif",
          }}
        >
          Már van fiókod?{" "}
          <Link
            to="/login"
            style={{
              color: "#f4a261",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Lépj be itt!
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;
