import React from "react";
import { useCampaign } from "../context/CampaignContext"; // 🔹 Kampány állapot használata
import "./GlobalBackground.css"; // 🔹 Stílus importálása

const GlobalBackground: React.FC = () => {
  const { campaign } = useCampaign(); // 🔹 Aktuális kampány adatai

  return (
    <div className="background-container">
      {/* 🔹 Háttérvideó */}
      <video className="background-video" autoPlay loop muted>
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* 🔹 Színes overlay (kampánytól függően változik) */}
      <div
        className="background-overlay"
        style={{
          background: `linear-gradient(180deg, ${campaign.colors[0]}99, ${campaign.colors[1]}99)`, // Átlátszóság hozzáadása
        }}
      />
    </div>
  );
};

export default GlobalBackground;
