import React from "react";
import { Paper, Typography, TextField } from "@mui/material";

interface CombatStatBoxProps {
  label: string;
  value: number;
  isEditing: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CombatStatBox: React.FC<CombatStatBoxProps> = ({ label, value, isEditing, onChange }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        width: 130,
        height: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2a2a40",
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        borderRadius: 2,
        border: "3px solid rgba(0, 0, 0, 0.39)",
        textAlign: "center",
        padding: 1,
      }}
    >
      <Typography variant="body2" sx={{ fontSize: 14 }}>
        {label}
      </Typography>
      {isEditing ? (
        <TextField
          name={label.toLowerCase()}
          type="number"
          value={value}
          onChange={onChange}
          sx={{
            width: "100px",
            textAlign: "center",
            input: { textAlign: "center", fontSize: "18px", color: "white" },
          }}
        />
      ) : (
        <Typography variant="h6">{value}</Typography>
      )}
    </Paper>
  );
};

export default CombatStatBox;
