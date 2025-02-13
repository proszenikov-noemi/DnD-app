import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const HeroesTab: React.FC = () => {
  const [newCombatant, setNewCombatant] = useState({
    name: "",
    battleOrder: "",
    hp: "",
    maxHp: "", // 🔹 Max HP is added
    ac: "",
    color: "#000000",
  });

  const handleAddCombatant = async () => {
    if (!newCombatant.name || isNaN(parseInt(newCombatant.battleOrder)) || isNaN(parseInt(newCombatant.hp)) || isNaN(parseInt(newCombatant.ac))) return;

    try {
      await addDoc(collection(db, "combatants"), {
        name: newCombatant.name,
        battleOrder: parseInt(newCombatant.battleOrder, 10),
        hp: parseInt(newCombatant.hp, 10),
        maxHp: parseInt(newCombatant.hp, 10), // 🔹 Max HP is saved as the initial HP
        ac: parseInt(newCombatant.ac, 10),
        color: newCombatant.color,
      });

      setNewCombatant({ name: "", battleOrder: "", hp: "", maxHp: "", ac: "", color: "#000000" });
    } catch (error) {
      console.error("❌ Hiba történt hős hozzáadásakor:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
      <Typography variant="h5" sx={{ fontFamily: "Cinzel, serif", color: "#FFD700" }}>
        Hős hozzáadása
      </Typography>

      <TextField label="Név" value={newCombatant.name} onChange={(e) => setNewCombatant({ ...newCombatant, name: e.target.value })} fullWidth />
      <TextField label="Initiative" type="number" value={newCombatant.battleOrder} onChange={(e) => setNewCombatant({ ...newCombatant, battleOrder: e.target.value })} fullWidth />
      <TextField label="Életpont (HP)" type="number" value={newCombatant.hp} onChange={(e) => setNewCombatant({ ...newCombatant, hp: e.target.value, maxHp: e.target.value })} fullWidth />
      <TextField label="Páncél (AC)" type="number" value={newCombatant.ac} onChange={(e) => setNewCombatant({ ...newCombatant, ac: e.target.value })} fullWidth />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>Szín:</Typography>
        <input type="color" value={newCombatant.color} onChange={(e) => setNewCombatant({ ...newCombatant, color: e.target.value })} />
      </Box>

      <Button variant="contained" color="primary" onClick={handleAddCombatant}>
        Hős Hozzáadása
      </Button>
    </Box>
  );
};

export default HeroesTab;
