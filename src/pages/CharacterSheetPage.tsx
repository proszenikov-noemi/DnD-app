import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import StatusBox from "../components/StatusBox";
import CombatStatBox from "../components/CombatStatBox";

interface Character {
  name: string;
  race: string;
  class: string;
  walkSpeed: number;
  initiative: number;
  armorClass: number;
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
}

const CharacterSheet: React.FC = () => {
  const [character, setCharacter] = useState<Character>({
    name: "",
    race: "",
    class: "",
    walkSpeed: 30,
    initiative: 0,
    armorClass: 10,
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 📱 Mobilnézet ellenőrzése

  useEffect(() => {
    const fetchCharacterData = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const charDoc = doc(db, "characters", userId);
      const charSnap = await getDoc(charDoc);

      if (charSnap.exists()) {
        const data = charSnap.data() as Character;
        setCharacter((prev) => ({
          ...prev,
          ...data, // 🔹 Megőrizzük a régi adatokat és az újakat is betöltjük
        }));
      }
    };

    fetchCharacterData();
  }, []);

  const saveCharacterData = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const charDoc = doc(db, "characters", userId);
    await setDoc(charDoc, character, { merge: true });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("abilities.")) {
      const abilityName = name.split(".")[1];
      setCharacter((prev) => ({
        ...prev,
        abilities: {
          ...prev.abilities,
          [abilityName]: parseInt(value, 10) || 0,
        },
      }));
    } else {
      setCharacter((prev) => ({
        ...prev,
        [name]: isNaN(parseInt(value, 10)) ? value : parseInt(value, 10),
      }));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          backgroundColor: "#1e1e2e",
          color: "#ffffff",
          borderRadius: 4,
        }}
      >
        {/* 🔹 Vissza a főoldalra gomb */}
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginBottom: 2 }}
          onClick={() => navigate("/profile")}
        >
          Vissza a főoldalra
        </Button>

        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          {isEditing ? (
            <>
              <TextField name="name" label="Név" value={character.name} onChange={handleChange} fullWidth />
              <TextField name="race" label="Faj" value={character.race} onChange={handleChange} fullWidth />
              <TextField name="class" label="Kaszt" value={character.class} onChange={handleChange} fullWidth />
            </>
          ) : (
            <>
              <Typography variant="h4">{character.name || "N/A"}</Typography>
              <Typography variant="body1">
                {character.race || "N/A"} | {character.class || "N/A"}
              </Typography>
            </>
          )}

          {/* 🔹 Harci statok (mobilbarát!) */}
          <Box
            display="grid"
            gridTemplateColumns={isMobile ? "1fr" : "repeat(3, 1fr)"} // 📱 Mobilon egymás alatt, nagy képernyőn egy sorban
            gap={1} // Rugalmas távolság
            sx={{
              backgroundColor: "#2a2a40",
              padding: 2,
              borderRadius: 2,
            }}
          >
            <CombatStatBox label="Sebesség" value={character.walkSpeed} isEditing={isEditing} onChange={handleChange} />
            <CombatStatBox label="Védőérték" value={character.armorClass} isEditing={isEditing} onChange={handleChange} />
            <CombatStatBox label="Kezdeményezés" value={character.initiative} isEditing={isEditing} onChange={handleChange} />
          </Box>

          {/* 🔹 Fő képességek (mobilbarát!) */}
          <Box
            display="grid"
            gridTemplateColumns={isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)"} // 📱 Mobilon 2 oszlop, nagy képernyőn 3 oszlop
            gap={1} // Rugalmas távolság
          >
            {Object.entries(character.abilities).map(([ability, score]) => {
              const modifier = Math.floor((score - 10) / 2);
              return (
                <StatusBox key={ability} ability={ability.toUpperCase()} modifier={modifier} score={score} isEditing={isEditing} onChange={handleChange} />
              );
            })}
          </Box>

          {/* 🔹 Szerkesztés/Mentés gombok */}
          <Box sx={{ marginTop: 4, textAlign: "center" }}>
            {isEditing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={saveCharacterData}
              >
                Mentés
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsEditing(true)} // 🔹 Szerkesztési mód bekapcsolása
              >
                Szerkesztés
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CharacterSheet;
