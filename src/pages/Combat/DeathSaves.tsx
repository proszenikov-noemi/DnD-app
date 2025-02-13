import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

const monsters = [
  { name: "Goblin", hp: 7, ac: 15, battleOrder: 10 },
  { name: "Ork", hp: 15, ac: 13, battleOrder: 12 },
  { name: "Kobold", hp: 5, ac: 12, battleOrder: 8 },
  { name: "Sárkány", hp: 150, ac: 18, battleOrder: 20 },
];

const MonsterList: React.FC = () => {
  const handleAddMonster = async (monster: { name: string; hp: number; ac: number; battleOrder: number }) => {
    try {
      await addDoc(collection(db, "combatants"), {
        name: monster.name,
        battleOrder: monster.battleOrder,
        hp: monster.hp,
        ac: monster.ac,
        status: [],
      });
    } catch (error) {
      console.error("Hiba történt a szörny hozzáadásakor:", error);
    }
  };

  return (
    <Paper elevation={4} sx={{ padding: 2, marginTop: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
        Szörnylista
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {monsters.map((monster, index) => (
          <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ padding: "8px", borderBottom: "1px solid gray" }}>
            <Typography variant="body1">{monster.name} - HP: {monster.hp} - AC: {monster.ac}</Typography>
            <Button variant="contained" color="secondary" size="small" onClick={() => handleAddMonster(monster)}>
              Hozzáadás
            </Button>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default MonsterList;
