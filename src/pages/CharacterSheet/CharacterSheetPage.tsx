import React, { useState, useEffect } from "react";
import { Container, Paper, Box, Tabs, Tab, Typography, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { db, auth } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import StatTab from "./StatTab";
import InventoryTab from "./InventoryTab";

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
  const [character, setCharacter] = useState<Character | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditingTop, setIsEditingTop] = useState(false);

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

  const handleSaveTop = async () => {
    if (character) {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const charDoc = doc(db, "characters", userId);
      await setDoc(charDoc, character, { merge: true });
      setIsEditingTop(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCharacter((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (!character) {
    return (
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            backgroundColor: "#1e1e2e",
            color: "#ffffff",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h5">Adatok betöltése...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          backgroundColor: "#1e1e2e",
          color: "#ffffff",
          borderRadius: 4,
        }}
      >
        {/* Felső rész */}
        <Box display="flex" flexDirection="column" alignItems="center" position="relative" gap={2}>
          <IconButton
            onClick={() => (isEditingTop ? handleSaveTop() : setIsEditingTop(true))}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              color: "#ffffff",
            }}
          >
            {isEditingTop ? <SaveIcon /> : <EditIcon />}
          </IconButton>

          <Box
            sx={{
              width: "120px",
              height: "120px",
              backgroundColor: "#000",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "3px solid #ffffff",
            }}
          >
            <Typography variant="h6">Profil Kép</Typography>
          </Box>

          {isEditingTop ? (
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <TextField
                name="name"
                label="Név"
                value={character.name}
                onChange={handleEditChange}
                fullWidth
                sx={{
                  input: { color: "#fff", backgroundColor: "#2a2a40" },
                }}
              />
              <TextField
                name="race"
                label="Faj"
                value={character.race}
                onChange={handleEditChange}
                fullWidth
                sx={{
                  input: { color: "#fff", backgroundColor: "#2a2a40" },
                }}
              />
              <TextField
                name="class"
                label="Kaszt"
                value={character.class}
                onChange={handleEditChange}
                fullWidth
                sx={{
                  input: { color: "#fff", backgroundColor: "#2a2a40" },
                }}
              />
            </Box>
          ) : (
            <>
              <Typography variant="h4">{character.name}</Typography>
              <Typography variant="body1">
                {character.race} | {character.class}
              </Typography>
            </>
          )}
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{
            marginTop: 3,
            "& .MuiTab-root": {
              color: "#ffffff",
              textTransform: "none",
            },
          }}
        >
          <Tab label="Statok" />
          <Tab label="Inventory" />
        </Tabs>

        <Box sx={{ marginTop: 3 }}>
          {activeTab === 0 && character && <StatTab character={character} onChange={handleEditChange} />}
          {activeTab === 1 && character && <InventoryTab character={character} />}
        </Box>
      </Paper>
    </Container>
  );
};

export default CharacterSheet;
