import React from "react";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
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
}

const StatTab: React.FC<StatTabProps> = ({ character }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 📱 Mobil nézet ellenőrzése

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
        gridTemplateColumns={isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)"} // 📱 Mobilon 2 oszlop, asztali nézetben 3 oszlop
        gap={isMobile ? 1 : 2} // 📱 Mobilon kisebb távolság
        sx={{
          backgroundColor: "#2a2a40",
          padding: isMobile ? 1 : 2, // 📱 Mobilon kisebb padding
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
