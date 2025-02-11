import React, { useState } from "react";
import { Box, Button } from "@mui/material";
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
  const [isEditing, setIsEditing] = useState(false);
  const [abilities, setAbilities] = useState({ ...character.abilities });

  const handleStatChange = (ability: string, newValue: number) => {
    setAbilities((prev) => ({
      ...prev,
      [ability]: newValue,
    }));
  };

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gap={2}
        sx={{ backgroundColor: "#2a2a40", padding: 2, borderRadius: 2 }}
      >
        {Object.entries(abilities).map(([ability, score]) => {
          const modifier = Math.floor((score - 10) / 2); // Modifier számítása
          return (
            <StatusBox
              key={ability}
              ability={ability}
              modifier={modifier} // 🔹 Modifier elküldése a StatusBox-nak
              score={score}
              isEditing={isEditing}
              onChange={handleStatChange}
            />
          );
        })}
      </Box>

      <Box sx={{ marginTop: 3, textAlign: "center" }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Mentés" : "Szerkesztés"}
        </Button>
      </Box>
    </>
  );
};

export default StatTab;
