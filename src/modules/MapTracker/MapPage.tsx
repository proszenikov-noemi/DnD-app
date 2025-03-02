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
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    const unsubscribe = onSnapshot(charactersCollection, (snapshot) => {
      const updatedCharacters = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Character));
      setCharacters(updatedCharacters);
      setLocalCharacters(updatedCharacters);
    });

    return () => unsubscribe();
  }, []);

  const calculateTrianglePositions = (baseX: number, baseY: number, count: number) => {
    const spacing = 1; // 🔥 Szoros háromszög - 2% távolság maximum
    const positions = [];

    if (count === 1) {
      positions.push({ x: baseX, y: baseY });
    } else {
      let currentRow = 0;
      let charsInRow = 1;
      let placed = 0;

      while (placed < count) {
        for (let i = 0; i < charsInRow && placed < count; i++) {
          const offsetX = (i - (charsInRow - 1) / 2) * spacing; // Sor középre igazítva
          const offsetY = currentRow * spacing * 0.9; // Kissé összenyomott sorok, hogy szoros legyen
          positions.push({
            x: baseX + offsetX,
            y: baseY + offsetY,
          });
          placed++;
        }
        currentRow++;
        charsInRow++;
      }
    }

    return positions;
  };

  const handleMapClick = async (event: React.MouseEvent) => {
    if (selectedCharacters.length === 0) return;

    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const mapRect = mapElement.getBoundingClientRect();
    const baseX = ((event.clientX - mapRect.left) / mapRect.width) * 100;
    const baseY = ((event.clientY - mapRect.top) / mapRect.height) * 100;

    const positions = calculateTrianglePositions(baseX, baseY, selectedCharacters.length);

    const updates = selectedCharacters.map((charId, index) => {
      const { x, y } = positions[index];

      setLocalCharacters((prev) =>
        prev.map((char) => (char.id === charId ? { ...char, x, y } : char))
      );

      return { charId, x, y };
    });

    setTimeout(async () => {
      try {
        for (const update of updates) {
          const characterRef = doc(db, "mapCharacters", update.charId);
          await updateDoc(characterRef, { x: update.x, y: update.y });
        }
      } catch (error) {
        console.error("❌ Hiba történt a karakterek mozgatásakor:", error);
      }

      setSelectedCharacters([]);
    }, 500);
  };

  const handleCharacterClick = (e: React.MouseEvent, charId: string) => {
    e.stopPropagation();
    setSelectedCharacters((prev) =>
      prev.includes(charId)
        ? prev.filter((id) => id !== charId)
        : [...prev, charId]
    );
  };

  const calculateCharacterSize = () => {
    const baseSize = 18;
    const size = baseSize / zoomScale;
    return Math.max(12, size);
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
            {localCharacters.map((char) => {
              const isSelected = selectedCharacters.includes(char.id);
              const size = calculateCharacterSize();

              return (
                <Box
                  key={char.id}
                  onClick={(e) => handleCharacterClick(e, char.id)}
                  sx={{
                    position: "absolute",
                    left: `${char.x}%`,
                    top: `${char.y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundImage: `url('${char.image}')`,
                    backgroundSize: "cover",
                    borderRadius: "50%",
                    border: `1px solid ${char.color}`,
                    cursor: "pointer",
                    transform: "translate(-50%, -50%)",
                    transition: "left 0.5s linear, top 0.5s linear",
                    boxShadow: isSelected ? "0px 0px 15px yellow" : "none",
                    zIndex: isSelected ? 10 : 1,
                  }}
                />
              );
            })}
          </Box>
        </TransformComponent>
      </TransformWrapper>
    </Box>
  );
};

export default MapPage;
