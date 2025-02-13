import React, { useState } from "react";
import {
  Paper,
  Typography,
  IconButton,
  Box,
  TextField,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import StatusIcons from "./StatusIcons";
import DeathSaves from "./DeathSaves";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface Combatant {
  id: string;
  name: string;
  hp: number;
  ac: number;
  status: string[];
}

const CombatantCard: React.FC<{ combatant: Combatant }> = ({ combatant }) => {
  const [hp, setHp] = useState(combatant.hp);
  const [manualEdit, setManualEdit] = useState(false);

  const handleHpChange = async (amount: number) => {
    const newHp = hp + amount;
    setHp(newHp);
    await updateDoc(doc(db, "combatants", combatant.id), { hp: newHp });
  };

  const handleManualHpChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setHp(value);
      await updateDoc(doc(db, "combatants", combatant.id), { hp: value });
    }
  };

  return (
    <Paper elevation={4} sx={{ padding: 2, textAlign: "center", position: "relative" }}>
      <Typography variant="h5">{combatant.name}</Typography>
      <Box display="flex" justifyContent="center" gap={2} alignItems="center">
        {/* AC pajzs ikonban */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", backgroundColor: "#BFA", padding: "5px 10px", borderRadius: "10px" }}>
            AC: {combatant.ac}
          </Typography>
        </Box>

        {/* HP módosítás */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <IconButton onClick={() => handleHpChange(1)}><ArrowDropUpIcon /></IconButton>
          {manualEdit ? (
            <TextField
              type="number"
              value={hp}
              onChange={handleManualHpChange}
              onBlur={() => setManualEdit(false)}
            />
          ) : (
            <Typography variant="h6" onClick={() => setManualEdit(true)}>{hp}</Typography>
          )}
          <IconButton onClick={() => handleHpChange(-1)}><ArrowDropDownIcon /></IconButton>
        </Box>
      </Box>

      {/* Állapot ikonok és halált mentések */}
      <StatusIcons statusList={combatant.status} />
      <DeathSaves />
    </Paper>
  );
};

export default CombatantCard;
