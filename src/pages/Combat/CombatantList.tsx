import React from "react";
import { Box } from "@mui/material";
import CombatantCard from "./CombatantCard";

interface Combatant {
  id: string;
  name: string;
  battleOrder: number;
  hp: number;
  maxHp: number;
  ac: number;
  color: string;
}

interface CombatantListProps {
  combatants: Combatant[];
}

const CombatantList: React.FC<CombatantListProps> = ({ combatants }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 3,
        marginTop: 4,
        justifyContent: "center",
      }}
    >
      {combatants.map((combatant) => (
        <CombatantCard key={combatant.id} {...combatant} />
      ))}
    </Box>
  );
};

export default CombatantList;
