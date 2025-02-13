import React, { useState } from "react";
import { Box, Typography, IconButton, TextField, Paper } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/ArrowDropUp";
import KeyboardArrowDownIcon from "@mui/icons-material/ArrowDropDown";
import ShieldIcon from "@mui/icons-material/Shield";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

interface CombatantCardProps {
  id: string;
  name: string;
  battleOrder: number;
  hp: number;
  maxHp: number;
  ac: number;
  color: string;
}

const CombatantCard: React.FC<CombatantCardProps> = ({
  id,
  name,
  battleOrder,
  hp,
  maxHp,
  ac,
  color,
}) => {
  const [damageInput, setDamageInput] = useState("");

  const getHpColor = (hp: number, maxHp: number) => {
    if (maxHp <= 0) return "#777777";
    const percentage = (hp / maxHp) * 100;
    if (percentage > 50) return "#4CAF50";
    if (percentage > 20) return "#FFA500";
    if (percentage > 0) return "#FF4444";
    return "#777777";
  };

  const handleHpChange = async (amount: number) => {
    await updateDoc(doc(db, "combatants", id), { hp: hp + amount });
  };

  const handleDamageSubmit = async () => {
    const damage = parseInt(damageInput, 10);
    if (!isNaN(damage)) {
      await handleHpChange(-damage);
      setDamageInput("");
    }
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "combatants", id));
  };

  return (
    <Paper
      elevation={4}
      sx={{
        padding: 3,
        textAlign: "center",
        backgroundColor: "#1e1e2e",
        borderRadius: 3,
        border: `3px solid ${color}`,
        position: "relative",
        width: "320px",
      }}
    >
      <IconButton onClick={handleDelete} sx={{ position: "absolute", top: 5, right: 5, color: "#ff4d4d" }}>
        <DeleteIcon />
      </IconButton>

      <Typography variant="h4">{battleOrder} - {name}</Typography>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, marginTop: 2 }}>
        <IconButton onClick={() => handleHpChange(1)} sx={{ color: "#4CAF50" }}>
          <KeyboardArrowUpIcon fontSize="large" />
        </IconButton>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: getHpColor(hp, maxHp),
            padding: "6px 12px",
            borderRadius: "6px",
            minWidth: "50px",
          }}
        >
          {hp}
        </Typography>

        <IconButton onClick={() => handleHpChange(-1)} sx={{ color: "#FF4444" }}>
          <KeyboardArrowDownIcon fontSize="large" />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, backgroundColor: "#555", borderRadius: "8px", padding: "5px 10px", color: "#FFD700" }}>
          <ShieldIcon />
          <Typography variant="h6">{ac}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, marginTop: 2 }}>
        <TextField
          label="Sebzés"
          type="number"
          value={damageInput}
          onChange={(e) => setDamageInput(e.target.value)}
          sx={{
            width: "160px",
            input: { textAlign: "center", fontSize: "16px", color: "white", backgroundColor: "#333" },
          }}
        />
        <IconButton onClick={handleDamageSubmit} sx={{ color: "#FFD700" }}>
          <SportsMmaIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default CombatantCard;
