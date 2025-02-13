import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel, Typography } from "@mui/material";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const initialMonsters = [
  { name: "Orc", ac: 13, hp: 15, color: "#4b8b3b" },
  { name: "Goblin", ac: 15, hp: 7, color: "#4a752c" },
  { name: "Bandit", ac: 12, hp: 11, color: "#8b4513" },
];

const MonstersTab: React.FC = () => {
  const [selectedMonster, setSelectedMonster] = useState<string>("");
  const [customMonster, setCustomMonster] = useState({ name: "", ac: "", hp: "", color: "#000000" });
  const [monsters, setMonsters] = useState([...initialMonsters, { name: "Egyéb", ac: 0, hp: 0, color: "#000000" }]);

  const handleAddMonster = async () => {
    if (!selectedMonster) return;

    if (selectedMonster === "Egyéb") {
      if (!customMonster.name || isNaN(parseInt(customMonster.hp)) || isNaN(parseInt(customMonster.ac))) return;

      try {
        await addDoc(collection(db, "combatants"), {
          name: customMonster.name,
          battleOrder: 10, // Default initiative
          hp: parseInt(customMonster.hp, 10),
          maxHp: parseInt(customMonster.hp, 10), // 🔹 Max HP added
          ac: parseInt(customMonster.ac, 10),
          color: customMonster.color,
        });

        setCustomMonster({ name: "", ac: "", hp: "", color: "#000000" });
      } catch (error) {
        console.error("❌ Hiba történt az egyedi szörny hozzáadásakor:", error);
      }
    } else {
      const monsterData = monsters.find((m) => m.name === selectedMonster);
      if (!monsterData) return;

      try {
        await addDoc(collection(db, "combatants"), {
          name: monsterData.name,
          battleOrder: 10, // Default initiative
          hp: monsterData.hp,
          maxHp: monsterData.hp, // 🔹 Max HP added
          ac: monsterData.ac,
          color: monsterData.color,
        });
      } catch (error) {
        console.error("❌ Hiba történt a szörnyek hozzáadásakor:", error);
      }
    }
    setSelectedMonster("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
      <Typography variant="h5" sx={{ fontFamily: "Cinzel, serif", color: "#FFD700" }}>
        Szörnyek hozzáadása
      </Typography>

      <FormControl fullWidth>
        <InputLabel>Válassz egy szörnyet</InputLabel>
        <Select value={selectedMonster} onChange={(e) => setSelectedMonster(e.target.value)} label="Szörny">
          {monsters.map((monster) => (
            <MenuItem key={monster.name} value={monster.name}>
              {monster.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="secondary" onClick={handleAddMonster}>
        Szörny Hozzáadása
      </Button>
    </Box>
  );
};

export default MonstersTab;
