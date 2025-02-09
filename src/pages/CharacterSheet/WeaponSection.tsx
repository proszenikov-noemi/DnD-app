import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { db, auth } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const WeaponSection: React.FC = () => {
  const [weapons, setWeapons] = useState<string[]>([]);
  const [newWeapon, setNewWeapon] = useState("");
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchWeapons = async () => {
      if (!userId) return;

      const charDoc = doc(db, "characters", userId);
      const charSnap = await getDoc(charDoc);

      if (charSnap.exists()) {
        const data = charSnap.data();
        setWeapons(data.inventory?.weapons || []);
      }
    };

    fetchWeapons();
  }, [userId]);

  const saveWeapons = async (updatedWeapons: string[]) => {
    if (!userId) return;

    const charDoc = doc(db, "characters", userId);
    await updateDoc(charDoc, {
      "inventory.weapons": updatedWeapons,
    });
    setWeapons(updatedWeapons);
  };

  const addWeapon = () => {
    const updatedWeapons = [...weapons, newWeapon.trim()];
    saveWeapons(updatedWeapons);
    setNewWeapon("");
  };

  const removeWeapon = (index: number) => {
    const updatedWeapons = weapons.filter((_, i) => i !== index);
    saveWeapons(updatedWeapons);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#2a2a40",
        padding: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" color="#f4a261" sx={{ marginBottom: 2 }}>
        Weapons
      </Typography>
      <Box display="flex" gap={2} sx={{ marginBottom: 2 }}>
        <TextField
          label="Add Weapon"
          value={newWeapon}
          onChange={(e) => setNewWeapon(e.target.value)}
          fullWidth
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: "#333",
              color: "#fff",
            },
            "& .MuiInputLabel-root": { color: "#aaa" },
          }}
        />
        <Button variant="contained" color="primary" onClick={addWeapon}>
          Add
        </Button>
      </Box>
      {weapons.map((weapon, index) => (
        <Box
          key={index}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            backgroundColor: "#333",
            padding: 2,
            borderRadius: 2,
            marginBottom: 2,
            border: "1px solid #f4a261",
          }}
        >
          <Typography color="#fff">{weapon}</Typography>
          <Button variant="contained" color="error" onClick={() => removeWeapon(index)}>
            Remove
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default WeaponSection;
