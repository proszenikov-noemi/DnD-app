import React from "react";
import { Box } from "@mui/material";
import CombatantCard from "./CombatantCard";

interface Combatant {
  id: string;
  name: string;
  initiative: number;
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
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 2,
        padding: 2,
      }}
    >
      {combatants
        .filter((c) => c.initiative !== undefined) // 🔥 Ha nincs initiative, kiszűrjük
        .sort((a, b) => Number(b.initiative) - Number(a.initiative)) // 📌 Csökkenő sorrend
        .map((combatant) => (
          <CombatantCard key={combatant.id} {...combatant} />
        ))}
    </Box>
  );
};

export default CombatantList;
