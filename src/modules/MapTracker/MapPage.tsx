import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { db } from "../../firebase";
import { collection, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; // 📌 Zoomolás és navigáció

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
  const [zoomScale, setZoomScale] = useState(1); // 🔍 Zoom skála tárolása

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
      {/* 🔍 Modern zoom- és navigációs rendszer */}
      <TransformWrapper
        minScale={0.5} // 🔍 Minimum zoom
        maxScale={3} // 🔎 Maximum zoom
        onZoom={(e) => setZoomScale(e.state.scale)} // 📏 Zoom érték mentése
        limitToBounds={false}
        centerOnInit
      >
        <TransformComponent>
          {/* 📍 A térkép konténer */}
          <Box
            id="map"
            sx={{
              width: "1400px", // 📐 Nagyobb méret a könnyebb navigáció érdekében
              height: "900px",
              backgroundImage: `url('/phandalin-map.webp')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top center",
              position: "relative",
            }}
            onClick={handleMapClick}
          >
            {/* 📍 Karakterek, amelyek zoommal arányosan nőnek/kisebbednek */}
            {characters.map((char) => (
              <Box
                key={char.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCharacter(char.id);
                }}
                sx={{
                  position: "absolute",
                  left: `${char.x}%`,
                  top: `${char.y}%`,
                  width: `${Math.min(24, Math.max(12, 14 * (0.6 + zoomScale / 4))) }px`, // ✅ MAX méret 24px!
                  height: `${Math.min(24, Math.max(12, 14 * (0.6 + zoomScale / 4))) }px`,
                  backgroundImage: `url('${char.image}')`,
                  backgroundSize: "cover",
                  borderRadius: "50%",
                  border: `1px solid ${char.color}`,
                  cursor: "pointer",
                  transform: "translate(-50%, -50%)",
                  transition: "transform 0.2s ease-in-out, width 0.2s ease-in-out, height 0.2s ease-in-out",
                  boxShadow: selectedCharacter === char.id ? "0px 0px 10px #FFD700" : "none",
                }}
              />
            ))}
          </Box>
        </TransformComponent>
      </TransformWrapper>
    </Box>
  );
};

export default MapPage;
