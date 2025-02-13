import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Box, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/ArrowDropUp'; // 🔼 HP növelés
import KeyboardArrowDownIcon from '@mui/icons-material/ArrowDropDown'; // 🔽 HP csökkentés
import ShieldIcon from '@mui/icons-material/Shield';
import SportsMmaIcon from '@mui/icons-material/SportsMma'; // 🗡 Kard ikon
import { db } from '../../firebase';
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

interface Combatant {
  id: string;
  name: string;
  battleOrder: number;
  hp: number;
  ac: number;
  color: string;
}

const CombatPage: React.FC = () => {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [newCombatant, setNewCombatant] = useState({ name: '', battleOrder: '', hp: '', ac: '', color: '#000000' });
  const [damageInput, setDamageInput] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const combatRef = collection(db, 'combatants');
    const unsubscribe = onSnapshot(combatRef, (snapshot) => {
      const combatantsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Combatant));
      setCombatants(combatantsData.sort((a, b) => b.battleOrder - a.battleOrder));
    });

    return () => unsubscribe();
  }, []);

  const handleAddCombatant = async () => {
    if (!newCombatant.name || isNaN(parseInt(newCombatant.battleOrder)) || isNaN(parseInt(newCombatant.hp)) || isNaN(parseInt(newCombatant.ac))) return;

    try {
      await addDoc(collection(db, 'combatants'), {
        name: newCombatant.name,
        battleOrder: parseInt(newCombatant.battleOrder, 10),
        hp: parseInt(newCombatant.hp, 10),
        ac: parseInt(newCombatant.ac, 10),
        color: newCombatant.color,
      });

      setNewCombatant({ name: '', battleOrder: '', hp: '', ac: '', color: '#000000' });
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
        await updateDoc(combatantRef, { hp: updatedCombatant.hp + amount });
      }
    } catch (error) {
      console.error('❌ Hiba történt a HP frissítésekor:', error);
    }
  };

  const handleDamageSubmit = async (id: string) => {
    const damage = parseInt(damageInput[id], 10);
    if (!isNaN(damage)) {
      await handleUpdateHP(id, -damage);
      setDamageInput((prev) => ({ ...prev, [id]: '' }));
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={6} sx={{ padding: 4, backgroundColor: '#2a2d35', color: '#fff', textAlign: 'center', borderRadius: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Cinzel, serif', color: '#FFD700' }}>
          Harc
        </Typography>

        {/* Harcos Hozzáadása */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, marginBottom: 4 }}>
          <TextField label="Név" value={newCombatant.name} onChange={(e) => setNewCombatant({ ...newCombatant, name: e.target.value })} />
          <TextField label="Initiative" type="number" value={newCombatant.battleOrder} onChange={(e) => setNewCombatant({ ...newCombatant, battleOrder: e.target.value })} />
          <TextField label="Életpont (HP)" type="number" value={newCombatant.hp} onChange={(e) => setNewCombatant({ ...newCombatant, hp: e.target.value })} />
          <TextField label="Páncél (AC)" type="number" value={newCombatant.ac} onChange={(e) => setNewCombatant({ ...newCombatant, ac: e.target.value })} />
          <input type="color" value={newCombatant.color} onChange={(e) => setNewCombatant({ ...newCombatant, color: e.target.value })} />
          <Button variant="contained" color="primary" onClick={handleAddCombatant}>Hozzáadás</Button>
        </Box>

        {/* Harcosok listája */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
          {combatants.map((c) => (
            <Paper key={c.id} elevation={4} sx={{ padding: 3, textAlign: 'center', backgroundColor: '#1e1e2e', borderRadius: 3, border: `3px solid ${c.color}`, position: 'relative' }}>
              <IconButton edge="end" onClick={() => handleDeleteCombatant(c.id)} sx={{ position: 'absolute', top: 5, right: 5, color: '#ff4d4d' }}>
                <DeleteIcon />
              </IconButton>

              <Typography variant="h4">{c.battleOrder} - {c.name}</Typography>

              {/* HP és AC egy sorban */}
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 3, marginTop: 2 }}>
                <IconButton onClick={() => handleUpdateHP(c.id, 1)} sx={{ color: "#4CAF50", fontSize: "24px" }}>
                  <KeyboardArrowUpIcon fontSize="large" />
                </IconButton>

                <Typography variant="h5" sx={{ fontWeight: "bold", color: "red", backgroundColor: "#fff", padding: "4px 10px", borderRadius: "6px" }}>
                  {c.hp}
                </Typography>

                <IconButton onClick={() => handleUpdateHP(c.id, -1)} sx={{ color: "#FF4444", fontSize: "24px" }}>
                  <KeyboardArrowDownIcon fontSize="large" />
                </IconButton>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, backgroundColor: "#555", borderRadius: "8px", padding: "5px 10px", color: "#FFD700" }}>
                  <ShieldIcon />
                  <Typography variant="h6">{c.ac}</Typography>
                </Box>
              </Box>

              {/* Sebzés mező */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, marginTop: 2 }}>
                <TextField label="Sebzés" type="number" value={damageInput[c.id] || ''} onChange={(e) => setDamageInput((prev) => ({ ...prev, [c.id]: e.target.value }))} />
                <IconButton onClick={() => handleDamageSubmit(c.id)} sx={{ color: "#FFD700" }}>
                  <SportsMmaIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default CombatPage;
