import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CharacterSheetPage: React.FC = () => {
  const [characterName, setCharacterName] = useState('');
  const [characterClass, setCharacterClass] = useState('');
  const [characterRace, setCharacterRace] = useState('');
  const [strength, setStrength] = useState('');
  const [dexterity, setDexterity] = useState('');
  const [constitution, setConstitution] = useState('');
  const [intelligence, setIntelligence] = useState('');
  const [wisdom, setWisdom] = useState('');
  const [charisma, setCharisma] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacter = async () => {
      if (auth.currentUser) {
        const charRef = doc(db, 'characters', auth.currentUser.uid);
        const charSnap = await getDoc(charRef);
        if (charSnap.exists()) {
          const data = charSnap.data();
          setCharacterName(data.name || '');
          setCharacterClass(data.class || '');
          setCharacterRace(data.race || '');
          setStrength(data.strength || '');
          setDexterity(data.dexterity || '');
          setConstitution(data.constitution || '');
          setIntelligence(data.intelligence || '');
          setWisdom(data.wisdom || '');
          setCharisma(data.charisma || '');
        }
      }
    };

    fetchCharacter();
  }, []);

  const handleSaveCharacter = async () => {
    if (auth.currentUser) {
      await setDoc(doc(db, 'characters', auth.currentUser.uid), {
        name: characterName,
        class: characterClass,
        race: characterRace,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
      });

      // ✅ Új: Navigáljunk vissza a profil oldalra mentés után
      navigate('/profile');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, backgroundColor: 'background.paper' }}>
        <Typography variant="h1" align="center">Karakterlap</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Karakter neve" fullWidth value={characterName} onChange={(e) => setCharacterName(e.target.value)} />
          <TextField label="Kaszt" fullWidth value={characterClass} onChange={(e) => setCharacterClass(e.target.value)} />
          <TextField label="Faj" fullWidth value={characterRace} onChange={(e) => setCharacterRace(e.target.value)} />
          <TextField label="Erő (Strength)" type="number" fullWidth value={strength} onChange={(e) => setStrength(e.target.value)} />
          <TextField label="Ügyesség (Dexterity)" type="number" fullWidth value={dexterity} onChange={(e) => setDexterity(e.target.value)} />
          <TextField label="Állóképesség (Constitution)" type="number" fullWidth value={constitution} onChange={(e) => setConstitution(e.target.value)} />
          <TextField label="Intelligencia (Intelligence)" type="number" fullWidth value={intelligence} onChange={(e) => setIntelligence(e.target.value)} />
          <TextField label="Bölcsesség (Wisdom)" type="number" fullWidth value={wisdom} onChange={(e) => setWisdom(e.target.value)} />
          <TextField label="Karizma (Charisma)" type="number" fullWidth value={charisma} onChange={(e) => setCharisma(e.target.value)} />
          <Button variant="contained" color="primary" onClick={handleSaveCharacter}>
            Karakter mentése
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CharacterSheetPage;
