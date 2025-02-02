import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, TextField, Box, Select, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface Combatant {
  id: number;
  name: string;
  battleOrder: number;
  hp: number;
  statusEffects: string[];
  color: string;
}

const STATUS_EFFECTS = [
  "Blinded", "Charmed", "Deafened", "Exhaustion", "Frightened",
  "Grappled", "Incapacitated", "Invisible", "Paralyzed", "Petrified",
  "Poisoned", "Prone", "Restrained", "Stunned", "Unconscious"
];

const CombatPage: React.FC = () => {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [newCombatant, setNewCombatant] = useState({ name: '', battleOrder: '', hp: '', color: '#000000' });
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCombatants = async () => {
      try {
        const combatRef = collection(db, 'combat'); // 🔹 Közös adatbázis
        const snapshot = await getDocs(combatRef);
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Combatant));
        setCombatants(members);
      } catch (error) {
        console.error("🔥 Hiba történt a Firestore adatlekérés során:", error);
      }
    };
    fetchCombatants();
  }, []);

  const saveCombatantsToFirestore = async (updatedCombatants: Combatant[]) => {
    if (auth.currentUser) {
      await setDoc(doc(db, 'combat', auth.currentUser.uid), { combatants: updatedCombatants });
    }
  };

  const handleAddCombatant = () => {
    if (!newCombatant.name || !newCombatant.battleOrder || !newCombatant.hp) return;

    const newEntry: Combatant = {
      id: Date.now(),
      name: newCombatant.name,
      battleOrder: parseInt(newCombatant.battleOrder, 10),
      hp: parseInt(newCombatant.hp, 10),
      statusEffects: [],
      color: newCombatant.color,
    };

    const updatedCombatants = [...combatants, newEntry].sort((a, b) => b.battleOrder - a.battleOrder);
    setCombatants(updatedCombatants);
    saveCombatantsToFirestore(updatedCombatants);
    setNewCombatant({ name: '', battleOrder: '', hp: '', color: '#000000' });
  };

  const handleDeleteCombatant = (id: number) => {
    const updatedCombatants = combatants.filter(c => c.id !== id);
    setCombatants(updatedCombatants);
    saveCombatantsToFirestore(updatedCombatants);
  };

  const handleUpdateHP = (id: number, amount: number) => {
    const updatedCombatants = combatants.map(c =>
      c.id === id ? { ...c, hp: Math.max(0, c.hp + amount) } : c
    );
    setCombatants(updatedCombatants);
    saveCombatantsToFirestore(updatedCombatants);
  };

  const handleAddStatusEffect = (id: number) => {
    if (!selectedStatus) return;
    const updatedCombatants = combatants.map(c =>
      c.id === id ? { ...c, statusEffects: [...new Set([...c.statusEffects, selectedStatus])] } : c
    );
    setCombatants(updatedCombatants);
    saveCombatantsToFirestore(updatedCombatants);
  };

  const handleRemoveStatusEffect = (id: number, effect: string) => {
    const updatedCombatants = combatants.map(c =>
      c.id === id ? { ...c, statusEffects: c.statusEffects.filter(e => e !== effect) } : c
    );
    setCombatants(updatedCombatants);
    saveCombatantsToFirestore(updatedCombatants);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={6} sx={{ padding: 4, backgroundColor: 'background.paper', textAlign: 'center', position: 'relative' }}>
        {/* Vissza gomb a bal felső sarokban */}
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

        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
          <TextField label="Név" value={newCombatant.name} onChange={(e) => setNewCombatant({ ...newCombatant, name: e.target.value })} />
          <TextField label="Harci sorrend" type="number" value={newCombatant.battleOrder} onChange={(e) => setNewCombatant({ ...newCombatant, battleOrder: e.target.value })} />
          <TextField label="Életpont (HP)" type="number" value={newCombatant.hp} onChange={(e) => setNewCombatant({ ...newCombatant, hp: e.target.value })} />
          <input type="color" value={newCombatant.color} onChange={(e) => setNewCombatant({ ...newCombatant, color: e.target.value })} />
          <Button variant="contained" color="primary" onClick={handleAddCombatant} sx={{ width: '150px' }}>
            Hozzáadás
          </Button>
        </Box>

        <Box sx={{ marginTop: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
          {combatants.map((c) => (
            <Paper 
              key={c.id} 
              elevation={4} 
              sx={{ padding: 2, textAlign: 'center', position: 'relative', border: `3px solid ${c.color}` }}
            >
              {/* Karakter törlése gomb a jobb felső sarokban */}
              <IconButton edge="end" onClick={() => handleDeleteCombatant(c.id)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                <DeleteIcon />
              </IconButton>

              <Typography variant="h4" sx={{ fontFamily: 'MedievalSharp, serif' }}>
                {c.battleOrder} - {c.name}
              </Typography>

              <Typography variant="h5" color="primary" sx={{ marginY: 1 }}>
                HP: {c.hp}
              </Typography>

              <Button variant="outlined" color="secondary" onClick={() => handleUpdateHP(c.id, -1)}>
                -1 HP
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => handleUpdateHP(c.id, +1)}>
                +1 HP
              </Button>

              <Box>
                {c.statusEffects.map(effect => (
                  <Box key={effect} display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="body2">{effect}</Typography>
                    <IconButton size="small" onClick={() => handleRemoveStatusEffect(c.id, effect)}>
                      <RemoveCircleIcon fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} displayEmpty fullWidth sx={{ marginTop: 2 }}>
                <MenuItem value="" disabled>Állapot kiválasztása</MenuItem>
                {STATUS_EFFECTS.map(effect => (
                  <MenuItem key={effect} value={effect}>{effect}</MenuItem>
                ))}
              </Select>
              <Button variant="contained" color="warning" onClick={() => handleAddStatusEffect(c.id)} sx={{ marginTop: 1 }}>
                Állapot Hozzáadása
              </Button>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default CombatPage;
