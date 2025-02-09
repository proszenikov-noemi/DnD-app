import React from "react";
import { Box, Typography, Button } from "@mui/material";
import StatusBox from "../../components/StatusBox";

interface Abilities {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

interface StatTabProps {
  character: {
    abilities: Abilities;
  } | null; // Lehetséges, hogy a karakter undefined vagy null
}

const StatTab: React.FC<StatTabProps> = ({ character }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Adatok mentése
  };

  // Ha nincs karakter vagy abilities, megjelenítünk egy hibaüzenetet
  if (!character || !character.abilities) {
    return (
      <Typography sx={{ color: "#fff", textAlign: "center", marginTop: 2 }}>
        Nincs elérhető karakter adat!
      </Typography>
    );
  }

  return (
    <>
      {/* Statok megjelenítése */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gap={2}
        sx={{
          backgroundColor: "#2a2a40",
          padding: 2,
          borderRadius: 2,
        }}
      >
        {Object.entries(character.abilities).map(([ability, score]) => {
          const modifier = Math.floor((score - 10) / 2);
          return (
            <StatusBox
              key={ability}
              ability={ability.toUpperCase()}
              modifier={modifier}
              score={score}
              isEditing={isEditing}
            />
          );
        })}
      </Box>

      {/* Mentés és Szerkesztés gombok */}
      <Box sx={{ marginTop: 3, textAlign: "center" }}>
        {isEditing ? (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Mentés
          </Button>
        ) : (
          <Button variant="outlined" color="secondary" onClick={handleEdit}>
            Szerkesztés
          </Button>
        )}
      </Box>
    </>
  );
};

export default StatTab;
