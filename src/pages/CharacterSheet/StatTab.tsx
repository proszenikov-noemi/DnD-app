import React, { useState, useEffect } from "react";
import { Box, Button, Paper } from "@mui/material";
import StatusBox from "../../components/StatusBox";
import { db, auth } from "../../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const FIXED_STAT_ORDER = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

const StatTab: React.FC<{ character: any }> = ({ character }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [abilities, setAbilities] = useState<{ [key: string]: number }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (character?.abilities) {
      setAbilities({ ...character.abilities });
    }
  }, [character]);

  const handleStatChange = (ability: string, newValue: number) => {
    setAbilities((prev) => ({
      ...prev,
      [ability]: Math.min(20, Math.max(1, newValue)),
    }));
  };

  const handleSave = async () => {
    if (!auth.currentUser || !character.id) return;

    setSaving(true);
    const characterRef = doc(db, "characters", character.id);
    await updateDoc(characterRef, { abilities });
    setSaving(false);
    setIsEditing(false);
  };

  return (
    <Paper
      sx={{
        backgroundColor: "#1e1e2e",
        padding: 4,
        borderRadius: 4,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 3,
          justifyContent: "center",
          alignItems: "center",
          "@media (max-width: 600px)": {
            gridTemplateColumns: "repeat(2, 1fr)",
          },
        }}
      >
        {FIXED_STAT_ORDER.map((ability) => {
          const score = abilities[ability] ?? 10;
          const modifier = Math.floor((score - 10) / 2);

          return (
            <StatusBox
              key={ability}
              ability={ability}
              modifier={modifier}
              score={score}
              isEditing={isEditing}
              onChange={handleStatChange}
            />
          );
        })}
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 3 }}
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
      >
        {isEditing ? "Mentés" : "Szerkesztés"}
      </Button>
    </Paper>
  );
};

export default StatTab;
