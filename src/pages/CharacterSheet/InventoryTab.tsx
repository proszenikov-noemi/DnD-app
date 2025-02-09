import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import WeaponSection from "./WeaponSection";
import ItemSection from "./ItemSection";

interface InventoryTabProps {
  character: {
    name: string;
    race: string;
    class: string;
    // Add further fields if needed
  };
}

const InventoryTab: React.FC<InventoryTabProps> = ({ character }) => {
  const [activeTab, setActiveTab] = useState<"weapon" | "item">("weapon");

  return (
    <Box>
      {/* Fül váltó gombok */}
      <Box display="flex" justifyContent="center" gap={2} sx={{ marginBottom: 3 }}>
        <Button
          variant={activeTab === "weapon" ? "contained" : "outlined"}
          onClick={() => setActiveTab("weapon")}
          sx={{
            color: activeTab === "weapon" ? "#fff" : "#f4a261",
            backgroundColor: activeTab === "weapon" ? "#f4a261" : "transparent",
          }}
        >
          Weapons
        </Button>
        <Button
          variant={activeTab === "item" ? "contained" : "outlined"}
          onClick={() => setActiveTab("item")}
          sx={{
            color: activeTab === "item" ? "#fff" : "#f4a261",
            backgroundColor: activeTab === "item" ? "#f4a261" : "transparent",
          }}
        >
          Items
        </Button>
      </Box>

      {/* Weapon vagy Item szekció betöltése */}
      {activeTab === "weapon" && <WeaponSection />}
      {activeTab === "item" && <ItemSection />}
    </Box>
  );
};

export default InventoryTab;
