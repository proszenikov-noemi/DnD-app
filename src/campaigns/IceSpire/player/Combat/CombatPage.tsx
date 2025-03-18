import React, { useState, useEffect } from "react"; 
import HeroesTab from "./HeroesTab";
import MonstersTab from "./MonstersTab";
import CombatantList from "./CombatantList";
import NavigationBar from "../../../../shared/components/NavigationBar";
import { collection, onSnapshot, setDoc, doc } from "firebase/firestore";
import { db } from "../../../../shared/utils/firebase";

interface Combatant {
  id: string;
  name: string;
  battleOrder: number;
  hp: number;
  maxHp: number;
  ac: number;
  type: "hero" | "monster";  // 🔥 Megkülönböztetjük a hősöket és a szörnyeket
}

const CombatPage: React.FC = () => {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  // 🔥 Új harcos hozzáadása a Firestore-hoz
  const handleAddCombatant = async (combatant: Combatant) => {
    console.log(`🔥 Hozzáadás: ${combatant.name}`);

    // 🔥 Először frissítjük a lokális állapotot
    setCombatants((prevCombatants) => {
      const isAlreadyAdded = prevCombatants.some((c) => c.id === combatant.id);
      if (isAlreadyAdded) return prevCombatants;

      return [...prevCombatants, combatant].sort((a, b) => b.battleOrder - a.battleOrder);
    });

    // 🔥 Mentés Firestore-ba
    try {
      const combatRef = doc(db, "combatants", combatant.id);
      await setDoc(combatRef, combatant);
      console.log(`✅ ${combatant.name} elmentve Firestore-ba!`);
    } catch (error) {
      console.error("🔥 Hiba a harcos mentésekor:", error);
    }
  };

  useEffect(() => {
    console.log("📥 Firestore betöltés...");
    const combatRef = collection(db, "combatants");

    // 🔥 Firestore adatfigyelés (ha frissítés történik, akkor a state frissül)
    const unsubscribe = onSnapshot(combatRef, (snapshot) => {
      const combatantsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Combatant[];

      console.log("✅ Harcosok betöltve Firestore-ból:", combatantsData);
      setCombatants(combatantsData.sort((a, b) => b.battleOrder - a.battleOrder));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <NavigationBar />

      <h1>Harc</h1>

      {/* Tabs - Hősök & Szörnyek */}
      <div>
        <button onClick={() => setActiveTab(0)}>Hősök</button>
        <button onClick={() => setActiveTab(1)}>Szörnyek</button>
      </div>

      {/* Tartalom fülek szerint */}
      <div>
        {activeTab === 0 && <HeroesTab onAddHero={handleAddCombatant} />}
        {activeTab === 1 && <MonstersTab onAddMonster={handleAddCombatant} />}
      </div>

      {/* Kártyák listázása */}
      <CombatantList combatants={combatants} />
    </div>
  );
};

export default CombatPage;

