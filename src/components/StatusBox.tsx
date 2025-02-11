import React, { useState } from "react";
import { Paper, Typography, TextField, Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface StatusBoxProps {
  ability: string;
  modifier: number;
  score: number;
  isEditing: boolean;
  onChange: (ability: string, newValue: number) => void;
  isCombatStat?: boolean;
}

const StatusBox: React.FC<StatusBoxProps> = ({
  ability,
  modifier,
  score,
  isEditing,
  onChange,
  isCombatStat = false,
}) => {
  const [tempScore, setTempScore] = useState<string>(score.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setTempScore(""); // Ha üres, ne jelenjen meg NaN
    } else {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 20) {
        // 🔹 Ellenőrizzük, hogy az érték 1 és 20 között legyen
        setTempScore(numericValue.toString());
        onChange(ability, numericValue);
      }
    }
  };

  const handleIncrement = () => {
    const newValue = Math.min(20, parseInt(tempScore || "1", 10) + 1); // 🔹 MAX 20
    setTempScore(newValue.toString());
    onChange(ability, newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(1, parseInt(tempScore || "1", 10) - 1); // 🔹 MIN 1
    setTempScore(newValue.toString());
    onChange(ability, newValue);
  };

  return isEditing ? (
    <Paper
      elevation={4}
      sx={{
        width: isCombatStat ? 80 : 130,
        height: isCombatStat ? 80 : 130,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2a2a40",
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        borderRadius: 2,
        border: "3px solid rgb(46, 5, 5)",
      }}
    >
      <Typography variant="h6" sx={{ fontSize: isCombatStat ? 12 : 14 }}>
        {ability}
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="center">
        <IconButton onClick={handleDecrement} sx={{ color: "#f44336" }}>
          <RemoveIcon />
        </IconButton>

        <TextField
          name={ability.toLowerCase()}
          type="number"
          value={tempScore}
          onChange={handleInputChange}
          onBlur={() => {
            if (tempScore === "") {
              setTempScore(score.toString());
            }
          }}
          sx={{
            width: 60,
            textAlign: "center",
            input: { textAlign: "center", fontSize: "18px", color: "white" },
          }}
        />

        <IconButton onClick={handleIncrement} sx={{ color: "#4caf50" }}>
          <AddIcon />
        </IconButton>
      </Box>
    </Paper>
  ) : (
    <svg
      width={isCombatStat ? "90" : "120"}
      height={isCombatStat ? "90" : "140"}
      viewBox="0 0 120 140"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 10 H110 Q115 10 115 15 V125 Q115 130 110 130 H10 Q5 130 5 125 V15 Q5 10 10 10 Z"
        fill="#1e1e2e"
        stroke="#4a4a5a"
        strokeWidth="3"
        rx="10"
      />

      <text
        x="50%"
        y="25"
        textAnchor="middle"
        fontSize={isCombatStat ? "12" : "14"}
        fontFamily="Arial"
        fill="#ffffff"
        fontWeight="bold"
      >
        {ability}
      </text>

      <rect
        x="35"
        y="35"
        width="50"
        height="30"
        rx="5"
        fill="#333333"
        stroke="#ffffff"
        strokeWidth="2"
      />
      <text
        x="50%"
        y="55"
        textAnchor="middle"
        fontSize="16"
        fontFamily="Arial"
        fill="#ffffff"
        fontWeight="bold"
      >
        {modifier > 0 ? `+${modifier}` : modifier}
      </text>

      <circle cx="60" cy="100" r="20" fill="#444" />
      <text
        x="50%"
        y="105"
        textAnchor="middle"
        fontSize="14"
        fontFamily="Arial"
        fill="#ffffff"
        fontWeight="bold"
      >
        {score}
      </text>
    </svg>
  );
};

export default StatusBox;
