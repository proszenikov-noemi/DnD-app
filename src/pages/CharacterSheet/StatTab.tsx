import React from "react";
import { Box, Typography, Button } from "@mui/material";
import StatusBox from "../../components/StatusBox";

interface StatTabProps {
  character: {
    abilities: {
      strength: number;
      dexterity: number;
      constitution: number;
      intelligence: number;
      wisdom: number;
      charisma: number;
    };
  };
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // ✅ OnChange prop hozzáadása
}

const StatTab: React.FC<StatTabProps> = ({ character, onChange }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Adatok mentése
  };

  return (
    <>
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
              onChange={onChange} // ✅ Továbbított prop
            />
          );
        })}
      </Box>
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
