import React, { useState, useEffect } from "react";
import { Container, Paper, Box, Tabs, Tab, Typography, IconButton, TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { db, auth, storage } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import StatTab from "./StatTab";
import InventoryTab from "./InventoryTab";

interface Character {
  id?: string;
  name: string;
  race: string;
  class: string;
  walkSpeed: number;
  initiative: number;
  armorClass: number;
  profilePicture?: string;
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
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCharacterData = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const charDoc = doc(db, "characters", userId);
      const charSnap = await getDoc(charDoc);

      if (charSnap.exists()) {
        setCharacter({ id: userId, ...charSnap.data() } as Character);
      }
    };

    fetchCharacterData();
  }, []);

  const handleSaveTop = async () => {
    if (!character || !character.id) return;

    const charDoc = doc(db, "characters", character.id);
    await setDoc(charDoc, character, { merge: true });
    setIsEditingTop(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCharacter((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !character || !character.id) return;

    setUploading(true);
    const file = event.target.files[0];
    const storageRef = ref(storage, `profilePictures/${character.id}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    setCharacter((prev) => (prev ? { ...prev, profilePicture: downloadURL } : prev));

    const charDoc = doc(db, "characters", character.id);
    await setDoc(charDoc, { profilePicture: downloadURL }, { merge: true });

    setUploading(false);
  };

  if (!character) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Paper elevation={6} sx={{ padding: 4, backgroundColor: "#1e1e2e", color: "#ffffff", borderRadius: 4, textAlign: "center" }}>
          <Typography variant="h5">Adatok betöltése...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Paper elevation={6} sx={{ padding: 4, backgroundColor: "#1e1e2e", color: "#ffffff", borderRadius: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" position="relative" gap={2}>
          <IconButton onClick={() => setIsEditingTop(!isEditingTop)} sx={{ position: "absolute", top: 10, right: 10, color: "#ffffff" }}>
            {isEditingTop ? <SaveIcon onClick={handleSaveTop} /> : <EditIcon />}
          </IconButton>

          {/* Profilkép */}
          <Box sx={{ width: "100px", height: "100px", borderRadius: "50%", border: "3px solid #ffffff", overflow: "hidden" }}>
            {character.profilePicture ? (
              <img src={character.profilePicture} alt="Profilkép" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Typography align="center">Profil Kép</Typography>
            )}
          </Box>

          {isEditingTop && <input type="file" accept="image/*" onChange={handleProfilePictureUpload} disabled={uploading} />}

          {/* Karakter adatok szerkesztése */}
          {isEditingTop ? (
            <Box display="flex" flexDirection="column" alignItems="center" gap={1} width="80%">
              <TextField name="name" label="Név" value={character.name} onChange={handleEditChange} fullWidth sx={{ input: { color: "#fff", backgroundColor: "#2a2a40" }}} />
              <TextField name="race" label="Faj" value={character.race} onChange={handleEditChange} fullWidth sx={{ input: { color: "#fff", backgroundColor: "#2a2a40" }}} />
              <TextField name="class" label="Kaszt" value={character.class} onChange={handleEditChange} fullWidth sx={{ input: { color: "#fff", backgroundColor: "#2a2a40" }}} />
            </Box>
          ) : (
            <>
              <Typography variant="h4">{character.name}</Typography>
              <Typography>{character.race} | {character.class}</Typography>
            </>
          )}
        </Box>

        {/* Tabok */}
        <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ marginTop: 3 }}>
          <Tab label="Statok" />
          <Tab label="Inventory" />
        </Tabs>

        {/* Tartalom */}
        <Box sx={{ marginTop: 3 }}>
          {activeTab === 0 && <StatTab character={character} />}
          {activeTab === 1 && <InventoryTab character={character} />}
        </Box>
      </Paper>
    </Container>
  );
};

export default CharacterSheet;
