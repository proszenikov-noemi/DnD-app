import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc, onSnapshot } from "firebase/firestore";

interface Character {
  id: string;
  name: string;
  image: string;
  color: string;
  x: number;
  y: number;
}

const charactersCollection = collection(db, "mapCharacters"); // Firestore kollekció

const MapPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [draggedCharacter, setDraggedCharacter] = useState<string | null>(null);

  useEffect(() => {
    // 🔹 REAL-TIME Firestore figyelő
    const unsubscribe = onSnapshot(charactersCollection, (snapshot) => {
      const updatedCharacters = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Character));
      setCharacters(updatedCharacters);
    });

    return () => unsubscribe(); // 🔹 Leiratkozás, amikor elhagyjuk az oldalt
  }, []);

  const handleDragStart = (id: string) => {
    setDraggedCharacter(id);
  };

  const handleDrop = async (event: React.DragEvent) => {
    if (!draggedCharacter) return;

    const mapRect = event.currentTarget.getBoundingClientRect();
    const newX = ((event.clientX - mapRect.left) / mapRect.width) * 100; // 🔹 Százalékos pozíció
    const newY = ((event.clientY - mapRect.top) / mapRect.height) * 100;

    try {
      const characterRef = doc(db, "mapCharacters", draggedCharacter);
      await updateDoc(characterRef, { x: newX, y: newY });
    } catch (error) {
      console.error("❌ Hiba történt a karakter mozgatásakor:", error);
    }

    setDraggedCharacter(null);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: `url('/phandalin-map.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onDragOver={(e) => e.preventDefault()} // 🔹 Engedélyezi a drag & drop-ot
      onDrop={handleDrop} // 🔹 Elem elengedése után frissítjük a pozíciót
    >
      {characters.map((char) => (
        <Box
          key={char.id}
          draggable
          onDragStart={() => handleDragStart(char.id)}
          sx={{
            position: "absolute",
            left: `${char.x}%`,
            top: `${char.y}%`,
            width: "50px",
            height: "50px",
            backgroundImage: `url('${char.image}')`,
            backgroundSize: "cover",
            borderRadius: "50%",
            border: `3px solid ${char.color}`,
            cursor: "grab",
            transform: "translate(-50%, -50%)", // 🔹 Középre igazítás
          }}
        />
      ))}

      <Typography
        variant="h5"
        sx={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "10px",
          borderRadius: "10px",
          fontFamily: "'MedievalSharp', serif",
        }}
      >
        Térkép - Húzd a karaktereket a megfelelő helyre!
      </Typography>
    </Box>
  );
};

export default MapPage;
