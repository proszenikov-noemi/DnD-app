import React, { useEffect, useState } from "react";

const NUM_LEAVES = 100; // 🌿 Ennyi levél szállingózik egyszerre
const LEAF_VARIANTS = 11; // 🍂 11 különböző levélkép (leaf1.png - leaf11.png)

interface Leaf {
  id: number;
  src: string;
  animationName: string;
  style: React.CSSProperties;
}

const FallingLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const generateLeaves = () => {
      const newLeaves: Leaf[] = Array.from({ length: NUM_LEAVES }, (_, i) => {
        const randomLeaf = Math.floor(Math.random() * LEAF_VARIANTS) + 1; // 1 és 11 között választunk egy levelet
        const randomSize = Math.random() * 50 + 50; // 📏 Kisebb levelek (50-120px)
        const animationName = `wind-blown-leaf-${i}`;

        return {
          id: i,
          src: `/leaf${randomLeaf}.png`, // 🌿 Véletlenszerű levélkép kiválasztása
          animationName,
          style: {
            position: "absolute",
            top: `${Math.random() * 60 - 10}vh`, // 🔼 Most felülről indulnak (-10vh és 20vh között)
            left: `${Math.random() * 80 + 50}vw`, // ➡ Jobb felső negyedben indulnak (60-100vw)
            opacity: Math.random() * 0.5 + 0.5, // Átlátszóság 0.5 - 1 között
            animation: `${animationName} ${Math.random() * 6 + 10}s linear infinite`, // ⏳ 8-14s animáció
            animationDelay: `${Math.random() * 3}s`,
            width: `${randomSize}px`, // 📏 Kisebb levelek (50-120px)
            height: "auto",
          },
        };
      });

      setLeaves(newLeaves); // ✅ Most már nem lesz piros aláhúzás!
    };

    generateLeaves();
  }, []);

  return (
    <div style={{ position: "absolute", width: "100vw", height: "100vh", overflow: "hidden", pointerEvents: "none" }}>
      {leaves.map((leaf) => (
        <img key={leaf.id} src={leaf.src} alt="Falling leaf" style={leaf.style} />
      ))}
      <style>
        {`
          ${leaves
            .map(
              (leaf) => `
            @keyframes ${leaf.animationName} {
              0% { transform: translate(0, 0) rotate(${Math.random() * 10 - 5}deg); opacity: ${leaf.style.opacity}; }
              100% { transform: translate(-120vw, 110vh) rotate(${Math.random() * 50 - 25}deg); opacity: 0; }
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

