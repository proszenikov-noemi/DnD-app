import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<{ username?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data() as { username?: string });
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
        {/* A "Profil" helyett a felhasználó neve, nagyobb méretben és fantasy betűtípussal */}
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontFamily: 'MedievalSharp, serif', fontSize: '36px', fontWeight: 'bold' }}
        >
          {userData?.username || 'Felhasználó'}
        </Typography>

        {userData ? (
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            {/* Gombok oszlopos elrendezése, fix szélességgel */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              sx={{ '& > *': { width: '200px' } }} // Fix szélesség minden gombra
            >
              <Button
                component={Link}
                to="/character-sheet"
                variant="contained"
                color="secondary"
              >
                Karakterlap
              </Button>
              <Button
                component={Link}
                to="/inventory"
                variant="contained"
                color="secondary"
              >
                Inventory
              </Button>
              <Button
                component={Link}
                to="/combat"
                variant="contained"
                color="error"
              >
                Harc
              </Button>
              <Button
                component={Link}
                to="/team"
                variant="contained"
                color="secondary"
              >
                Csapattagok
              </Button>
              <Button
                component={Link}
                to="/map"
                variant="contained"
                color="secondary"
              >
                Térkép
              </Button>
              <Button
                onClick={handleLogout}
                variant="contained"
                color="primary"
              >
                Kijelentkezés
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1">Adatok betöltése...</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
