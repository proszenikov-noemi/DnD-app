import React from "react";
import { Paper, Typography, TextField } from "@mui/material";

interface StatusBoxProps {
  ability: string;
  modifier: number;
  score: number;
  isEditing: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isCombatStat?: boolean; // 🔹 Ha harci stat, kisebb legyen a szöveg
}

const StatusBox: React.FC<StatusBoxProps> = ({
  ability,
  modifier,
  score,
  isEditing,
  onChange,
  isCombatStat = false,
}) => {
  return isEditing ? (
    <Paper
      elevation={4}
      sx={{
        width: isCombatStat ? 80 : 130, // 🔹 Harci statok kisebbek
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

      <TextField
        name={`abilities.${ability.toLowerCase()}`}
        type="number"
        value={score}
        onChange={onChange}
        sx={{
          width: 100,
          textAlign: "center",
          input: { textAlign: "center", fontSize: "18px", color: "white" },
        }}
      />
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
