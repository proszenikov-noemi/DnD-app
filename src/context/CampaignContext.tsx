import React, { createContext, useContext, useState } from "react";

// 🔹 Kampányok definiálása
const campaigns = {
  icepeak: {
    name: "Dragon of Icespire Peak",
    image: "/icespire.webp",
    colors: ["#002b4e", "#005a8d"], // Sötétkék téma
  },
  witchlight: {
    name: "The Wild Beyond the Witchlight",
    image: "/wild.jpg",
    colors: ["#4a125a", "#8d44ad"], // Lila téma
  },
};

// 📌 Kontextus létrehozása
const CampaignContext = createContext({
  campaign: campaigns.icepeak, // Alapértelmezett kampány
  setCampaign: (campaign: typeof campaigns.icepeak) => {},
});

// 📌 Kampány kontextus provider
export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaign, setCampaign] = useState(campaigns.icepeak);

  return (
    <CampaignContext.Provider value={{ campaign, setCampaign }}>
      {children}
    </CampaignContext.Provider>
  );
};

// 📌 Kampány kontextus használata
export const useCampaign = () => useContext(CampaignContext);
