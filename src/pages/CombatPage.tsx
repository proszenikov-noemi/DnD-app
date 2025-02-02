import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, TextField, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

interface Combatant {
  id: string;
  name: string;
  battleOrder: number;
  hp: number;
  color: string;
}

const CombatPage: React.FC = () => {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [newCombatant, setNewCombatant] = useState({ name: '', battleOrder: '', hp: '', color: '#000000' });
  const navigate = useNavigate();

  useEffect(() => {
    // **Firestore real-time listener a combatants kollekcióhoz**
    const combatRef = collection(db, 'combatants');
    const unsubscribe = onSnapshot(combatRef, (snapshot) => {
      const combatantsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Combatant));
      // **Rendezés initiative szerint (csökkenő sorrend)**
      setCombatants(combatantsData.sort((a, b) => b.battleOrder - a.battleOrder));
    });

    // **Leiratkozás a listener-ről, amikor az oldal elhagyásra kerül**
    return () => unsubscribe();
  }, []);

  const handleAddCombatant = async () => {
    if (!newCombatant.name || isNaN(parseInt(newCombatant.battleOrder)) || isNaN(parseInt(newCombatant.hp))) return;

    try {
      await addDoc(collection(db, 'combatants'), {
        name: newCombatant.name,
        battleOrder: parseInt(newCombatant.battleOrder, 10),
        hp: parseInt(newCombatant.hp, 10),
        color: newCombatant.color,
      });

      setNewCombatant({ name: '', battleOrder: '', hp: '', color: '#000000' });
    } catch (error) {
      console.error('❌ Hiba történt kártya hozzáadásakor:', error);
    }
  };

  const handleDeleteCombatant = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'combatants', id));
    } catch (error) {
      console.error('❌ Hiba történt a kártya törlésekor:', error);
    }
  };

  const handleUpdateHP = async (id: string, amount: number) => {
    try {
      const combatantRef = doc(db, 'combatants', id);
      const updatedCombatant = combatants.find(c => c.id === id);
      if (updatedCombatant) {
        await updateDoc(combatantRef, { hp: Math.max(0, updatedCombatant.hp + amount) });
      }
    } catch (error) {
      console.error('❌ Hiba történt a HP frissítésekor:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={6} sx={{ padding: 4, backgroundColor: 'background.paper', textAlign: 'center', position: 'relative' }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/profile')}
          sx={{ position: 'absolute', top: 10, left: 10 }}
        >
          Vissza a Profilra
        </Button>

        <Typography variant="h3" gutterBottom>
          Harc
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center" gap={2} sx={{ marginBottom: 4 }}>
          <TextField
            label="Név"
            value={newCombatant.name}
            onChange={(e) => setNewCombatant({ ...newCombatant, name: e.target.value })}
          />
          <TextField
            label="Harci sorrend"
            type="number"
            value={newCombatant.battleOrder}
            onChange={(e) => setNewCombatant({ ...newCombatant, battleOrder: e.target.value })}
          />
          <TextField
            label="Életpont (HP)"
            type="number"
            value={newCombatant.hp}
            onChange={(e) => setNewCombatant({ ...newCombatant, hp: e.target.value })}
          />
          <input
            type="color"
            value={newCombatant.color}
            onChange={(e) => setNewCombatant({ ...newCombatant, color: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={handleAddCombatant}>
            Kártya Hozzáadása
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
          {combatants.map((c) => (
            <Paper key={c.id} elevation={4} sx={{ padding: 2, textAlign: 'center', border: `3px solid ${c.color}`, position: 'relative' }}>
              <IconButton
                edge="end"
                onClick={() => handleDeleteCombatant(c.id)}
                sx={{ position: 'absolute', top: 5, right: 5 }}
              >
                <DeleteIcon />
              </IconButton>

              <Typography variant="h4">
                {c.battleOrder} - {c.name}
              </Typography>
              <Typography variant="h5" color="primary">
                HP: {c.hp}
              </Typography>
              <Box display="flex" justifyContent="center" gap={2} sx={{ marginTop: 2 }}>
                <Button variant="outlined" color="secondary" onClick={() => handleUpdateHP(c.id, -1)}>
                  -1 HP
                </Button>
                <Button variant="outlined" color="primary" onClick={() => handleUpdateHP(c.id, 1)}>
                  +1 HP
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default CombatPage;
