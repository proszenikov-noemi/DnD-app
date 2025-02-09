import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { db } from "../../firebase";
import { collection, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
  const [localCharacters, setLocalCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    const unsubscribe = onSnapshot(charactersCollection, (snapshot) => {
      const updatedCharacters = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Character));
      setCharacters(updatedCharacters);
      setLocalCharacters(updatedCharacters); // Szinkronizáljuk a helyi állapotot
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

    // Frissítsük a helyi állapotot az animációhoz
    setLocalCharacters((prev) =>
      prev.map((char) =>
        char.id === selectedCharacter ? { ...char, x: newX, y: newY } : char
      )
    );

    // Várjunk egy kicsit az animáció befejezéséhez
    setTimeout(async () => {
      try {
        const characterRef = doc(db, "mapCharacters", selectedCharacter);
        await updateDoc(characterRef, { x: newX, y: newY });
      } catch (error) {
        console.error("❌ Hiba történt a karakter mozgatásakor:", error);
      }

      setSelectedCharacter(null);
    }, 500); // Az animáció időtartamához igazítva
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
      <TransformWrapper
        minScale={0.5}
        maxScale={3}
        onZoom={(e) => setZoomScale(e.state.scale)}
        limitToBounds={false}
        centerOnInit
      >
        <TransformComponent>
          <Box
            id="map"
            sx={{
              width: "1400px",
              height: "900px",
              backgroundImage: `url('/phandalin-map.webp')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top center",
              position: "relative",
            }}
            onClick={handleMapClick}
          >
            {localCharacters.map((char) => (
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
                  width: `${Math.min(24, Math.max(12, 14 * (0.6 + zoomScale / 4)))}px`,
                  height: `${Math.min(24, Math.max(12, 14 * (0.6 + zoomScale / 4)))}px`,
                  backgroundImage: `url('${char.image}')`,
                  backgroundSize: "cover",
                  borderRadius: "50%",
                  border: `1px solid ${char.color}`,
                  cursor: "pointer",
                  transform: "translate(-50%, -50%)",
                  transition: "left 0.5s linear, top 0.5s linear", // 🔄 Animált mozgás
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
