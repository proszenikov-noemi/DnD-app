import React from "react";
import { Box, Tooltip } from "@mui/material";

interface StatusIconsProps {
  status?: string[]; // Lehet undefined is
}

const StatusIcons: React.FC<StatusIconsProps> = ({ status = [] }) => {
  if (!Array.isArray(status)) {
    console.error("❌ A status nem egy tömb!", status);
    return null; // Ha nem tömb, akkor ne rendereljünk semmit
  }

  const statusIcons = {
    stunned: "💫",
    poisoned: "☠️",
    blinded: "👁️‍🗨️",
    unconscious: "💤",
  };

  return (
    <Box display="flex" gap={1}>
      {status.length === 0 ? (
        <Tooltip title="Nincs aktív állapotjelző">
          <span>✅</span> {/* Ha nincs aktív státusz, akkor pipát mutat */}
        </Tooltip>
      ) : (
        status.map((condition, index) => (
          <Tooltip key={index} title={<span>{condition}</span>}>
            <span>{statusIcons[condition] || "❓"}</span>
          </Tooltip>
        ))
      )}
    </Box>
  );
};

export default StatusIcons;
