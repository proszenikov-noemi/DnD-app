import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<{ username?: string; email?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data() as { username?: string; email?: string });
          } else {
            console.error("A felhasználói adatok nem találhatók az adatbázisban!");
          }
        } catch (error) {
          console.error("Hiba történt az adatok betöltésekor:", error);
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/'); // Kijelentkezés után a főoldalra navigál
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, backgroundColor: 'background.paper', textAlign: 'center' }}>
        <Typography variant="h1">Profil</Typography>
        {userData ? (
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <Typography variant="h2">Név: {userData.username || 'Nincs név'}</Typography>
            <Typography variant="body1">Email: {userData.email || 'Nincs email'}</Typography>

            {/* Karakterlap gomb */}
            <Button component={Link} to="/character-sheet" variant="contained" color="secondary" sx={{ marginTop: 3 }}>
              Karakterlap Megtekintése
            </Button>

            {/* Kijelentkezés gomb */}
            <Button onClick={handleLogout} variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Kijelentkezés
            </Button>
          </Box>
        ) : (
          <Typography variant="body1">Adatok betöltése...</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
