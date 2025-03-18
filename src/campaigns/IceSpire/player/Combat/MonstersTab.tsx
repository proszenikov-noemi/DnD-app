import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Select, Typography } from "@mui/material";
import { db } from "../../../../shared/utils/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

// 🔹 Szörnyek listája
const monsterList = [
  { name: "Carrion Crawler", hp: 51, ac: 13 },
  { name: "Gorthok the Thunder Boar", hp: 95, ac: 16 },
  { name: "Needle Blight", hp: 11, ac: 12 },
  { name: "Vine Blight", hp: 26, ac: 12 },
  { name: "Twig Blight", hp: 4, ac: 13 },
  { name: "Ankheg", hp: 39, ac: 14 },
  { name: "Banshee", hp: 58, ac: 12 },
  { name: "Centaur", hp: 45, ac: 12 },
  { name: "Ghoul", hp: 22, ac: 12 },
  { name: "Giant Crab", hp: 13, ac: 15 },
  { name: "Giant Rat", hp: 7, ac: 12 },
  { name: "Giant Spider", hp: 26, ac: 14 },
  { name: "Harpy", hp: 38, ac: 13 },
  { name: "Manticore", hp: 68, ac: 14 },
  { name: "Mimic", hp: 58, ac: 12 },
  { name: "Ochre Jelly", hp: 45, ac: 8 },
  { name: "Ogre", hp: 59, ac: 11 },
  { name: "Orc", hp: 15, ac: 13 },
  { name: "Stirge", hp: 2, ac: 14 },
  { name: "Wererat", hp: 33, ac: 12 },
  { name: "Will-o'-Wisp", hp: 22, ac: 19 },
  { name: "Invisible Stalker", hp: 104, ac: 14 },
  { name: "Young White Dragon", hp: 133, ac: 17 },
];

const MonstersTab: React.FC<{ onAddCombatant: (combatant: any) => void }> = ({ onAddCombatant }) => {
  const [selectedMonster, setSelectedMonster] = useState<string>("");
  const [customMonster, setCustomMonster] = useState(false);
  const [monsterData, setMonsterData] = useState({ name: "", hp: "", ac: "", initiative: "", quantity: "1" });

  const handleMonsterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedName = event.target.value as string;
    if (selectedName === "custom") {
      setCustomMonster(true);
      setMonsterData({ name: "", hp: "", ac: "", initiative: "", quantity: "1" });
    } else {
      const foundMonster = monsterList.find((monster) => monster.name === selectedName);
      setCustomMonster(false);
      setMonsterData({
        name: foundMonster?.name || "",
        hp: foundMonster?.hp.toString() || "",
        ac: foundMonster?.ac.toString() || "",
        initiative: "",
        quantity: "1",
      });
    }
    setSelectedMonster(selectedName);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonsterData({ ...monsterData, [event.target.name]: event.target.value });
  };

  const handleAddMonster = async () => {
      if (!monsterData.name || isNaN(parseInt(monsterData.hp)) || isNaN(parseInt(monsterData.ac))) return;
  
      try {
          for (let i = 0; i < parseInt(monsterData.quantity, 10); i++) {
              // 🔥 Generálunk egy egyedi azonosítót a Firestore dokumentumnak
              const newMonsterRef = doc(collection(db, "combatants"));
  
              const monsterObject = {
                  id: newMonsterRef.id, // 🔹 A Firestore által generált azonosítót használjuk
                  name: monsterData.name + (parseInt(monsterData.quantity, 10) > 1 ? ` #${i + 1}` : ""),
                  hp: parseInt(monsterData.hp, 10),
                  maxHp: parseInt(monsterData.hp, 10),
                  ac: parseInt(monsterData.ac, 10),
                  initiative: parseInt(monsterData.initiative, 10),
                  color: "#8B0000",
              };
  
              // 🔹 Most setDoc() segítségével hozzuk létre az új szörny dokumentumot, az egyedi id-val
              await setDoc(newMonsterRef, monsterObject);
          }
  
          // 🔹 Reseteljük az űrlapot
          setSelectedMonster("");
          setMonsterData({ name: "", hp: "", ac: "", initiative: "", quantity: "1" });
      } catch (error) {
          console.error("❌ Hiba történt a szörny hozzáadásakor:", error);
      }
  };
  
  

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" sx={{ color: "#fff" }}>Válassz szörnyet:</Typography>
      <Select value={selectedMonster} onChange={handleMonsterChange} displayEmpty sx={{ backgroundColor: "#2a2d35", color: "#fff" }}>
        <MenuItem value="" disabled>Válassz szörnyet</MenuItem>
        {monsterList.map((monster) => (
          <MenuItem key={monster.name} value={monster.name}>{monster.name}</MenuItem>
        ))}
        <MenuItem value="custom">Egyéb (Saját szörny)</MenuItem>
      </Select>

      <TextField label="Initiative" name="initiative" type="number" value={monsterData.initiative} onChange={handleInputChange} />
      <TextField label="Darabszám" name="quantity" type="number" value={monsterData.quantity} onChange={handleInputChange} />

      {customMonster && (
        <>
          <TextField label="Név" name="name" value={monsterData.name} onChange={handleInputChange} />
          <TextField label="HP" name="hp" type="number" value={monsterData.hp} onChange={handleInputChange} />
          <TextField label="AC" name="ac" type="number" value={monsterData.ac} onChange={handleInputChange} />
        </>
      )}

      <Button variant="contained" color="primary" onClick={handleAddMonster}>Hozzáadás</Button>
    </Box>
  );
};

export default MonstersTab;
