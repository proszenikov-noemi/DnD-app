import React, { useState } from "react";
import { Box, Typography, IconButton, TextField, Paper, Select, MenuItem, Button, Tooltip } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/ArrowDropUp";
import KeyboardArrowDownIcon from "@mui/icons-material/ArrowDropDown";
import ShieldIcon from "@mui/icons-material/Shield";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import HealingIcon from "@mui/icons-material/LocalHospital";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block"; // Alapértelmezett ikon
import { collection, getDocs, getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../shared/utils/firebase";

interface CombatantCardProps {
  id: string;
  name: string;
  hp: number;
  initiative: number;
  maxHp: number;
  tempHp?: number;
  ac: number;
  color: string;
  conditions: string[];
}

const CombatantCard: React.FC<CombatantCardProps> = ({
  id,
  name,
  hp,
  initiative,
  maxHp,
  tempHp = 0,
  ac,
  color,
  conditions = [],
}) => {
  const calculatedMaxHp = maxHp + tempHp;
  const [damageInput, setDamageInput] = useState("");
  const [healInput, setHealInput] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [combatantConditions, setCombatantConditions] = useState<string[]>(conditions);


  // 📌 D&D 2024 állapotok
  const DND_CONDITIONS = [
    "Blinded", "Charmed", "Deafened", "Exhaustion", "Frightened",
    "Grapped", "Incapacitated", "Invisible", "Paralyzed", "Petrified", 
    "Poisoned", "Proned", "Restrained", "Stunned", "Unconscious"
  ];

  // Állapot ikonok hozzárendelése
  const DND_CONDITION_ICONS: { [key: string]: string } = {
    "Blinded": "/icons/hidden.png",
    "Charmed": "/icons/heart.png",
    "Deafened": "/icons/deaf.png",
    "Exhaustion": "/icons/tired.png",
    "Frightened": "/icons/scared.png",
    "Grapped": "/icons/jiu-jitsu.png",
    "Incapacitated": "/icons/disorder.png",
    "Invisible": "/icons/invisible-man.png",
    "Paralyzed": "/icons/stroke.png",
    "Petrified": "/icons/rocks.png",
    "Poisoned": "/icons/poison.png",
    "Proned": "/icons/prone.png",
    "Restrained": "/icons/tie-up.png",
    "Stunned": "/icons/stunned.png",
    "Unconscious": "/icons/man.png",
  };
  


  const getHpColor = (hp: number, maxHp: number, tempHp: number) => {
    const effectiveMaxHp = maxHp + tempHp; // 🔥 Helyesített maxHp kiszámítása

    if (effectiveMaxHp <= 0) return "#777777"; // Ha a max HP 0 vagy kisebb, szürke

    const percentage = (hp / effectiveMaxHp) * 100;

    if (percentage > 50) return "#4CAF50";  // Zöld (HP > 50%)
    if (percentage > 20) return "#FFA500";  // Narancs (HP 20-50% között)
    if (percentage > 0) return "#FF4444";   // Piros (HP 1-20% között)

    return "#777777"; // Szürke, ha a karakter 0 HP-n van (tehát "meghalt")
};


const handleHpChange = async (amount: number) => {
  console.log(`🛠️ HP módosítás indítása: ${name}, módosítás: ${amount}`);

  try {
      const combatantRef = doc(db, "combatants", id);
      const combatantSnap = await getDoc(combatantRef);

      if (combatantSnap.exists()) {
          const currentData = combatantSnap.data();
          const tempHp = currentData.tempHp ?? 0; // 🔥 Temp HP, ha nincs, akkor 0
          const newHp = currentData.hp + amount;  // HP módosítás
          const effectiveMaxHp = currentData.maxHp;  // 🔥 Nem növeljük a maxHp-t minden egyes alkalommal!

          // Frissítjük az adatokat, de NEM adunk hozzá extra tempHp-t minden alkalommal!
          await updateDoc(combatantRef, { hp: newHp });

          // 🔥 Ha a karakter egy játékos hőse, akkor frissítsük a karakterlapját is!
          if (id.startsWith("custom") || id.length > 10) {
              const campaignId = "icespire"; // 🔥 Ezt dinamikusan kellene betölteni!
              const characterRef = doc(db, "campaigns", campaignId, "characters", id);
              await updateDoc(characterRef, { hp: newHp });
              console.log(`✅ Karakterlap HP frissítve: ${newHp}`);
          }

          console.log(`✅ HP sikeresen frissítve: ${newHp}`);
      } else {
          console.warn(`⚠️ A harcos már nem létezik: ${id}`);
      }
  } catch (error) {
      console.error("❌ Hiba a HP frissítés közben:", error);
  }
};

  const handleDamageSubmit = async () => {
    const damage = parseInt(damageInput, 10);
    if (!isNaN(damage) && damage > 0) {
        console.log(`⚔️ Sebzés: ${damage} alkalmazása ${name} karakterre`);
  
        await handleHpChange(-damage);
        setDamageInput("");
    } else {
        console.warn("⚠️ Érvénytelen sebzés érték");
    }
  };
  
  const handleHealSubmit = async () => {
    const heal = parseInt(healInput, 10);
    if (!isNaN(heal)) {
      await handleHpChange(heal);
      setHealInput("");
    }
  };


const handleDelete = async () => {
  console.log(`🔥 Törlés indítása: ${id}`);

  try {
      // Ellenőrizzük, hogy a Firestore-ban az ID mezőhöz melyik dokumentum tartozik
      const combatantsRef = collection(db, "combatants");
      const querySnapshot = await getDocs(combatantsRef);
      
      let docIdToDelete = null;

      querySnapshot.forEach((doc) => {
          if (doc.data().id === id) {
              docIdToDelete = doc.id;
          }
      });

      if (docIdToDelete) {
          console.log(`✅ Megtalált dokumentum törléshez: ${docIdToDelete}`);
          await deleteDoc(doc(db, "combatants", docIdToDelete));
          console.log(`✅ Sikeresen törölve: ${docIdToDelete}`);
      } else {
          console.warn(`⚠️ Nem található dokumentum ezzel az id-val: ${id}`);
      }

  } catch (error) {
      console.error("❌ Hiba a törlés közben:", error);
  }
};

// 📌 Állapot hozzáadása
const handleAddCondition = async () => {
  if (!selectedCondition || combatantConditions.includes(selectedCondition)) return;

  const updatedConditions = [...combatantConditions, selectedCondition];

  try {
    const combatantRef = doc(db, "combatants", id);
    await updateDoc(combatantRef, { conditions: updatedConditions });

    setCombatantConditions(updatedConditions);
    setSelectedCondition("");
  } catch (error) {
    console.error("❌ Hiba az állapot frissítése közben:", error);
  }
};

const handleRemoveCondition = async (condition: string) => {
  const updatedConditions = combatantConditions.filter(c => c !== condition);

  try {
    const combatantRef = doc(db, "combatants", id);
    await updateDoc(combatantRef, { conditions: updatedConditions });

    setCombatantConditions(updatedConditions);
  } catch (error) {
    console.error("❌ Hiba az állapot eltávolítása közben:", error);
  }
};

  return (
    <Paper
      elevation={4}
      sx={{
        padding: 3,
        textAlign: "center",
        backgroundColor: "#ffffff",
        borderRadius: 3,
        border: `3px solid ${color}`,
        position: "relative",
        width: { xs: "100%", sm: "320px" },
        margin: "8px",
      }}
    >
      <IconButton onClick={handleDelete} sx={{ position: "absolute", top: 5, right: 5, color: "#ff4d4d" }}>
        <DeleteIcon />
      </IconButton>

      <Typography variant="h4" sx={{ color: "#000", fontWeight: "bold" }}>
        {initiative} - {name}
      </Typography>

      {/* Állapot ikonok megjelenítése a név alatt */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, marginTop: 1 }}>
        {combatantConditions.map((condition) => (
          <Tooltip key={condition} title={condition}>
            <IconButton onClick={() => handleRemoveCondition(condition)} sx={{ padding: 0 }}>
              <img 
                src={DND_CONDITION_ICONS[condition] || "/icons/default.png"} 
                alt={condition} 
                style={{ width: "24px", height: "24px" }}
              />
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, marginTop: 2 }}>
        <IconButton onClick={() => handleHpChange(1)} sx={{ color: "#4CAF50" }}>
          <KeyboardArrowUpIcon fontSize="large" />
        </IconButton>

        <Typography
           variant="h5"
           sx={{
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: getHpColor(hp, maxHp, tempHp),
            padding: "6px 12px",
            borderRadius: "6px",
            minWidth: "50px",
        }}
        >
        {hp}
        </Typography>



        <IconButton onClick={() => handleHpChange(-1)} sx={{ color: "#FF4444" }}>
          <KeyboardArrowDownIcon fontSize="large" />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, backgroundColor: "#ddd", borderRadius: "8px", padding: "5px 10px", color: "#000" }}>
          <ShieldIcon />
          <Typography variant="h6">{ac}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, marginTop: 2 }}>
        <TextField
          label="Sebzés"
          type="number"
          value={damageInput}
          onChange={(e) => setDamageInput(e.target.value)}
          sx={{
            width: "160px",
            input: { textAlign: "center", fontSize: "16px", color: "#000", backgroundColor: "#eee" },
          }}
        />
        <IconButton onClick={handleDamageSubmit} sx={{ color: "#FFD700" }}>
          <SportsMmaIcon />
        </IconButton>
      </Box>

      {/* Gyógyítás mező */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, marginTop: 2 }}>
        <TextField
          label="Gyógyítás"
          type="number"
          value={healInput}
          onChange={(e) => setHealInput(e.target.value)}
          sx={{ width: "160px", input: { textAlign: "center", fontSize: "16px", color: "black", backgroundColor: "#f5f5f5" } }}
        />
        <IconButton onClick={handleHealSubmit} sx={{ color: "#4CAF50" }}>
          <HealingIcon />
        </IconButton>
      </Box>

            {/* Állapotok kezelése */}
            <Box sx={{ marginTop: 2 }}>
        <Typography variant="h6">Állapotok kezelése</Typography>
        <Select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          displayEmpty
          sx={{ width: "100%", backgroundColor: "#ddd", borderRadius: 1, padding: "5px" }}
        >
          <MenuItem value="" disabled>Válassz állapotot...</MenuItem>
          {DND_CONDITIONS.map((condition) => (
            <MenuItem key={condition} value={condition}>
              <img 
                src={DND_CONDITION_ICONS[condition] || "/icons/default.png"} 
                alt={condition} 
                style={{ width: "16px", height: "16px", marginRight: "8px" }}
              />
              {condition}
            </MenuItem>
          ))}
        </Select>
        <Button onClick={handleAddCondition} sx={{ marginTop: 1, backgroundColor: "#4CAF50", color: "white" }}>Hozzáadás</Button>
      </Box>


    </Paper>
  );
};

export default CombatantCard;
