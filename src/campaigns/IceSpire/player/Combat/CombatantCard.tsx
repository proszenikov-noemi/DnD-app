import React, { useState } from "react";
import { Box, Typography, IconButton, TextField, Paper } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/ArrowDropUp";
import KeyboardArrowDownIcon from "@mui/icons-material/ArrowDropDown";
import ShieldIcon from "@mui/icons-material/Shield";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import HealingIcon from "@mui/icons-material/LocalHospital";  // Gyógyítás ikon
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, getDocs, getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../shared/utils/firebase";

interface CombatantCardProps {
  id: string;
  name: string;
  hp: number;
  initiative: number;
  maxHp: number;
  ac: number;
  color: string;
}

const CombatantCard: React.FC<CombatantCardProps> = ({
  id,
  name,
  hp,
  initiative,
  maxHp,
  ac,
  color,
}) => {
  const [damageInput, setDamageInput] = useState("");
  const [healInput, setHealInput] = useState(""); // Új mező a gyógyításra

  const getHpColor = (hp: number, maxHp: number) => {
    if (maxHp <= 0) return "#777777";
    const percentage = (hp / maxHp) * 100;
    if (percentage > 50) return "#4CAF50";
    if (percentage > 20) return "#FFA500";
    if (percentage > 0) return "#FF4444";
    return "#777777";
  };

  const handleHpChange = async (amount: number) => {
    console.log(`🛠️ HP módosítás indítása: ${name}, módosítás: ${amount}`);

    try {
        const combatantRef = doc(db, "combatants", id);
        const combatantSnap = await getDoc(combatantRef);

        if (combatantSnap.exists()) {
            const newHp = combatantSnap.data().hp + amount; // Engedjük a negatív értékeket is

            // 🔥 Ha a karakter egy játékos hőse, akkor frissítsük a karakterlapját is!
            if (id.startsWith("custom") || id.length > 10) { // Ha egyéni hős
                const campaignId = "icespire"; // 🔥 Ezt dinamikusan kellene betölteni!
                const characterRef = doc(db, "campaigns", campaignId, "characters", id);
                await updateDoc(characterRef, { hp: newHp });
                console.log(`✅ Karakterlap HP frissítve: ${newHp}`);
            }

            await updateDoc(combatantRef, { hp: newHp });
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

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, marginTop: 2 }}>
        <IconButton onClick={() => handleHpChange(1)} sx={{ color: "#4CAF50" }}>
          <KeyboardArrowUpIcon fontSize="large" />
        </IconButton>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: getHpColor(hp, maxHp),
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
    </Paper>
  );
};

export default CombatantCard;
