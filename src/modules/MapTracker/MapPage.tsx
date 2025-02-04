import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { db } from "../../firebase";
import { collection, updateDoc, doc, onSnapshot } from "firebase/firestore";

interface Character {
  id: string;
  name: string;
  image: string;
  color: string;
  x: number;
  y: number;
}

const charactersCollection = collection(db, "mapCharacters");

const MapPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(charactersCollection, (snapshot) => {
      const updatedCharacters = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Character));
      setCharacters(updatedCharacters);
    });

    return () => unsubscribe();
  }, []);

  const handleMapClick = async (event: React.MouseEvent) => {
    if (!selectedCharacter) return;

    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const mapRect = mapElement.getBoundingClientRect();
    const newX = ((event.clientX - mapRect.left) / mapRect.width) * 100;
    const newY = ((event.clientY - mapRect.top) / mapRect.height) * 100;

    try {
      const characterRef = doc(db, "mapCharacters", selectedCharacter);
      await updateDoc(characterRef, { x: newX, y: newY });
    } catch (error) {
      console.error("❌ Hiba történt a karakter mozgatásakor:", error);
    }

    setSelectedCharacter(null);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* 🔹 Térkép háttér */}
      <Box
        id="map"
        sx={{
          width: "100%", // Kitölti a teljes szélességet
          height: "auto",
          maxWidth: "1400px", // Nagyobb kijelzőkre optimalizálva
          flexGrow: 1,
          backgroundImage: `url('/phandalin-map.webp')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          overflowY: "auto", // 🔹 Görgethető térkép
          position: "relative",
        }}
        onClick={handleMapClick} // 🔹 Kattintáskor karakter mozgatás
      >
        {/* 🔹 Karakter ikonok a térképen */}
        {characters.map((char) => (
          <Box
            key={char.id}
            onClick={() => setSelectedCharacter(char.id)}
            sx={{
              position: "absolute",
              left: `${char.x}%`,
              top: `${char.y}%`,
              width: "20px", // Fix méret mobilon is
              height: "20px",
              backgroundImage: `url('${char.image}')`,
              backgroundSize: "cover",
              borderRadius: "50%",
              border: `3px solid ${char.color}`,
              cursor: "pointer",
              transform: "translate(-50%, -50%)",
              transition: "0.2s ease-in-out",
              boxShadow: selectedCharacter === char.id ? "0px 0px 10px #FFD700" : "none",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MapPage;
