import React, { useEffect, useState } from "react";
import { useCampaign } from "../context/CampaignContext"; // 🔹 Kampány állapot használata
import "./GlobalBackground.css"; // 🔹 Stílus importálása

const GlobalBackground: React.FC = () => {
  const { campaign } = useCampaign(); // 🔹 Aktuális kampány adatai
  const [gradient, setGradient] = useState("rgba(0,0,0,0.5)"); // Alapértelmezett háttér

  useEffect(() => {
    // 🔹 Ellenőrizzük, hogy vannak-e színek a kampányban
    if (campaign?.colors?.length >= 2) {
      setGradient(`linear-gradient(180deg, ${campaign.colors[0]}99, ${campaign.colors[1]}99)`);
    } else {
      setGradient("rgba(0,0,0,0.5)"); // Ha nincs színadat, használjunk egy alapárnyalatot
    }
  }, [campaign]);

  return (
    <div className="background-container">
      {/* 🔹 Háttérvideó */}
      <video className="background-video" autoPlay loop muted>
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* 🔹 Színes overlay (kampánytól függően változik) */}
      <div className="background-overlay" style={{ background: gradient }} />
    </div>
  );
};

export default GlobalBackground;

