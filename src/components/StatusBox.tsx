import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface StatusBoxProps {
  ability: string;
  modifier: number;
  score: number;
  isEditing: boolean;
  onChange: (ability: string, newValue: number) => void;
}

const StatusBox: React.FC<StatusBoxProps> = ({
  ability,
  modifier,
  score,
  isEditing,
  onChange,
}) => {
  const handleIncrement = () => {
    const newValue = Math.min(20, score + 1);
    onChange(ability, newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(1, score - 1);
    onChange(ability, newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        width: "120px",
        marginBottom: isEditing ? "20px" : "0", // Kicsit kisebb margó szerkesztésben
      }}
    >
      {/* Hexagon Shape */}
      <Box
        sx={{
          width: "120px",
          height: "140px",
          position: "relative",
        }}
      >
        <svg
          width="120"
          height="140"
          viewBox="0 0 120 140"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="60,5 115,35 115,105 60,135 5,105 5,35"
            fill="#1e1e2e"
            stroke="#a855f7"
            strokeWidth="3"
          />
        </svg>

        {/* Modifier (Középre helyezve és nagyobb mérettel) */}
        <Typography
          sx={{
            position: "absolute",
            top: "60px",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "40px", // Nagyobb méret
            fontWeight: "bold",
            color: "#ffffff",
          }}
        >
          {modifier >= 0 ? `+${modifier}` : modifier}
        </Typography>

        {/* Ability Név (Lentebb helyezve) */}
        <Typography
          sx={{
            position: "absolute",
            top: "85px", // Kicsit lejjebb, hogy ne ütközzön a modifierrel
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#ffffff",
          }}
        >
          {ability}
        </Typography>

        {/* Stat Érték (Alsó Kapszula) */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#a855f7",
            borderRadius: "20px",
            padding: "5px 15px",
            textAlign: "center",
            minWidth: "35px",
          }}
        >
          <Typography sx={{ color: "white", fontWeight: "bold" }}>
            {score}
          </Typography>
        </Box>
      </Box>

      {/* Szerkesztési Mód - Csak Plusz és Mínusz Gombok Lentebb */}
      {isEditing && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            marginTop: "10px", // Kisebb távolság, hogy ne lógjon túl
          }}
        >
          <IconButton onClick={handleDecrement} sx={{ color: "#f44336" }}>
            <RemoveIcon />
          </IconButton>

          <IconButton onClick={handleIncrement} sx={{ color: "#4caf50" }}>
            <AddIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default StatusBox;
