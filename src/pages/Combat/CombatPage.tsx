import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Tabs, Tab, Box } from "@mui/material";
import HeroesTab from "./HeroesTab";
import MonstersTab from "./MonstersTab";
import CombatantList from "./CombatantList";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

interface Combatant {
  id: string;
  name: string;
  battleOrder: number;
  hp: number;
  maxHp: number;
  ac: number;
  color: string;
}

const CombatPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [combatants, setCombatants] = useState<Combatant[]>([]);

  useEffect(() => {
    const combatRef = collection(db, "combatants");
    const unsubscribe = onSnapshot(combatRef, (snapshot) => {
      const combatantsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Combatant[];

      setCombatants(combatantsData.sort((a, b) => b.battleOrder - a.battleOrder));
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container maxWidth="lg">
      <Paper elevation={6} sx={{ padding: 4, backgroundColor: "#2a2d35", color: "#fff", textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ fontFamily: "Cinzel, serif", color: "#FFD700" }}>
          Harc
        </Typography>

        {/* Tabs - Hősök & Szörnyek hozzáadása */}
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} centered>
          <Tab label="Hősök" />
          <Tab label="Szörnyek" />
        </Tabs>

        {/* Tartalom fülek szerint */}
        <Box sx={{ marginTop: 3 }}>
          {activeTab === 0 && <HeroesTab />}
          {activeTab === 1 && <MonstersTab />}
        </Box>

        {/* Kártyák listázása */}
        <CombatantList combatants={combatants} />
      </Paper>
    </Container>
  );
};

export default CombatPage;
