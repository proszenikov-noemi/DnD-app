import React, { useEffect, useState } from "react";

const NUM_LEAVES = 15; // 🌿 Ennyi levél szállingózik egyszerre

const FallingLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    const generateLeaves = () => {
      const newLeaves = Array.from({ length: NUM_LEAVES }, (_, i) => ({
        id: i,
        style: {
          position: "absolute",
          top: `${Math.random() * 100}vh`, // Véletlenszerű kezdőmagasság
          left: "100vw", // A jobb szélén indulnak
          opacity: Math.random() * 0.5 + 0.5, // Átlátszóság 0.5 - 1 között
          animationDuration: `${Math.random() * 8 + 5}s`, // ⏳ Lassabb mozgás (5-13s)
          animationDelay: `${Math.random() * 3}s`,
          width: "400px",
          height: "400px",
        },
      }));
      setLeaves(newLeaves);
    };

    generateLeaves();
  }, []);

  return (
    <div style={{ position: "absolute", width: "100vw", height: "100vh", overflow: "hidden", pointerEvents: "none" }}>
      {leaves.map((leaf) => (
        <img
          key={leaf.id}
          src="/leaf.png" // 🌿 Használj egy megfelelő levél PNG-t!
          alt="Falling leaf"
          style={{
            ...leaf.style,
            animation: `wind-blown-leaf-${leaf.id} ${leaf.style.animationDuration} linear infinite`,
          }}
        />
      ))}
      <style>
        {`
          ${leaves
            .map(
              (leaf) => `
            @keyframes wind-blown-leaf-${leaf.id} {
              0% { transform: translate(0, 0) rotate(${Math.random() * 10 - 5}deg); opacity: ${leaf.style.opacity}; }
              25% { transform: translate(-25vw, ${Math.random() * 15 - 7.5}vh) rotate(${Math.random() * 20 - 10}deg); }
              50% { transform: translate(-50vw, ${Math.random() * 30 - 15}vh) rotate(${Math.random() * 30 - 15}deg); }
              75% { transform: translate(-75vw, ${Math.random() * 40 - 20}vh) rotate(${Math.random() * 40 - 20}deg); }
              100% { transform: translate(-110vw, ${Math.random() * 50 - 25}vh) rotate(${Math.random() * 50 - 25}deg); opacity: 0; }
            }
          `
            )
            .join("\n")}
        `}
      </style>
    </div>
  );
};

export default FallingLeaves;
