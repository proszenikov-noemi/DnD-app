import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import StatusBox from "../components/StatusBox";

interface Character {
  name: string;
  race: string;
  class: string;
  profBonus: number;
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
    profBonus: 0,
    walkSpeed: 0,
    initiative: 0,
    armorClass: 0,
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

  useEffect(() => {
    const fetchCharacterData = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const charDoc = doc(db, "characters", userId);
      const charSnap = await getDoc(charDoc);

      if (charSnap.exists()) {
        setCharacter(charSnap.data() as Character);
      }
    };

    fetchCharacterData();
  }, []);

  const saveCharacterData = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const charDoc = doc(db, "characters", userId);
    await setDoc(charDoc, character);
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
        {/* 🔹 Vissza a profil oldalra gomb */}
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
            <TextField
              name="name"
              label="Név"
              value={character.name}
              onChange={handleChange}
              fullWidth
            />
          ) : (
            <Typography variant="h4">{character.name || "N/A"}</Typography>
          )}

          {/* 🔹 Státusz statbox-ok (SVG vagy Input) */}
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
            {Object.entries(character.abilities).map(([ability, score]) => {
              const modifier = Math.floor((score - 10) / 2);
              return (
                <StatusBox
                  key={ability}
                  ability={ability.toUpperCase()}
                  modifier={modifier}
                  score={score}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
              );
            })}
          </Box>

          <Box sx={{ marginTop: 4, textAlign: "center" }}>
            {isEditing ? (
              <Button variant="contained" color="primary" onClick={saveCharacterData}>
                Mentés
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsEditing(true)}
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
