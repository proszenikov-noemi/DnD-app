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
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
  });

  const [isEditing, setIsEditing] = useState(false); // 🔹 Szerkesztési mód
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
    setIsEditing(false); // 🔹 Kilépés a szerkesztési módból
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
          <Box
            sx={{
              width: 100,
              height: 100,
              backgroundColor: "#333",
              borderRadius: "50%",
            }}
          >
            {/* 🔹 Profilkép */}
          </Box>

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

          {isEditing ? (
            <>
              <TextField
                name="race"
                label="Faj"
                value={character.race}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="class"
                label="Kaszt"
                value={character.class}
                onChange={handleChange}
                fullWidth
              />
            </>
          ) : (
            <Typography variant="body1">
              {character.race || "N/A"} | {character.class || "N/A"}
            </Typography>
          )}

          {/* 🔹 Statisztikák */}
          <Box display="flex" justifyContent="space-between" width="100%">
            {isEditing ? (
              <>
                <TextField
                  name="profBonus"
                  label="Prof. Bónusz"
                  value={character.profBonus}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
                <TextField
                  name="walkSpeed"
                  label="Sebesség"
                  value={character.walkSpeed}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
                <TextField
                  name="initiative"
                  label="Kezdeményezés"
                  value={character.initiative}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
                <TextField
                  name="armorClass"
                  label="Védőérték"
                  value={character.armorClass}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
              </>
            ) : (
              <>
                <Typography>{character.profBonus}</Typography>
                <Typography>{character.walkSpeed} ft.</Typography>
                <Typography>{character.initiative}</Typography>
                <Typography>{character.armorClass}</Typography>
              </>
            )}
          </Box>
        </Box>

        {/* 🔹 Képességek */}
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
          {Object.keys(character.abilities).map((ability) => (
            <Paper key={ability} elevation={4} sx={{ padding: 2, textAlign: "center" }}>
              {isEditing ? (
                <TextField
                  name={`abilities.${ability}`}
                  label={ability.toUpperCase()}
                  value={character.abilities[ability as keyof typeof character.abilities]}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
              ) : (
                <>
                  <Typography variant="subtitle1">
                    {character.abilities[ability as keyof typeof character.abilities]}
                  </Typography>
                  <Typography variant="caption">{ability.toUpperCase()}</Typography>
                </>
              )}
            </Paper>
          ))}
        </Box>

        {/* 🔹 Gombok: Mentés és Szerkesztés */}
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
      </Paper>
    </Container>
  );
};

export default CharacterSheet;
