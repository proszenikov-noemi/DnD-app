import React, { useState, useEffect } from 'react';
import { useCampaign } from '../../../../shared/context/CampaignContext';
import { db, auth } from '../../../../shared/utils/firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import NavigationBar from '../../../../shared/components/NavigationBar';
import { defaultCharacter } from '../../../../shared/utils/defaultCharacter';
import CharacterHeader from './CharacterHeader';
import StatsTab from './StatsTab';
import InventoryTab from './InventoryTab/InventoryTab';
import SpellsTab from './SpellsTab';
import SkillsTab from './SkillsTab';
import BackstoryTab from './BackstoryTab';
import { Box, Tab, Tabs, Typography } from '@mui/material';

const CharacterSheetPage: React.FC = () => {
    const { campaign } = useCampaign();
    const [character, setCharacter] = useState<any>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        // 🔥 Ellenőrizzük, hogy van-e bejelentkezett felhasználó és kampány
        if (!user || !campaign) {
            console.warn("⚠️ Nincs bejelentkezett felhasználó vagy kampány, várunk...");
            const interval = setInterval(() => {
                setUser(auth.currentUser);
            }, 500);

            // Ha 5 másodperc után sincs user vagy campaign, leállunk
            setTimeout(() => {
                clearInterval(interval);
                if (!auth.currentUser || !campaign) {
                    console.error("🔥 Kritikus hiba: A felhasználó vagy kampány nem érhető el!");
                    setLoading(false);
                }
            }, 5000);
            return () => clearInterval(interval);
        }

        console.log("📥 Karakter betöltése Firestore-ból...");
        const charRef = doc(db, 'campaigns', campaign, 'characters', user.uid);

        // 🔥 Firestore snapshot figyelés, valós idejű frissítés
        const unsubscribe = onSnapshot(charRef, async (charSnap) => {
            if (charSnap.exists()) {
                let characterData = charSnap.data();

                // Ellenőrizzük, hogy van-e `skills` és `savingThrows`
                let updatedFields: any = {};
                if (!characterData.skills) updatedFields.skills = defaultCharacter.skills;
                if (!characterData.savingThrows) updatedFields.savingThrows = defaultCharacter.savingThrows;

                if (Object.keys(updatedFields).length > 0) {
                    await updateDoc(charRef, updatedFields);
                    characterData = { ...characterData, ...updatedFields };
                }

                console.log("✅ Karakter betöltve:", characterData);
                setCharacter(characterData);
            } else {
                console.warn("⚠️ Nincs még karakter Firestore-ban, létrehozunk egyet...");
                await setDoc(charRef, defaultCharacter);
                setCharacter(defaultCharacter);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, campaign]);

    const updateCharacter = async (newData: any) => {
        if (!user || !campaign) {
            console.error("🔥 Hiba: Nem lehet frissíteni a karaktert, nincs bejelentkezett felhasználó vagy kampány!");
            return;
        }

        console.log("📝 Karakter frissítése Firestore-ban:", newData);
        const charRef = doc(db, 'campaigns', campaign, 'characters', user.uid);
        await updateDoc(charRef, newData);
        setCharacter((prev) => ({ ...prev, ...newData }));
    };

    if (loading) return <Typography sx={{ textAlign: 'center', marginTop: '20px' }}>🔄 Karakter betöltése...</Typography>;
    if (!character) return <Typography sx={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>🔥 Hiba: Nem sikerült betölteni a karaktert!</Typography>;

    return (
        <Box sx={{ paddingTop: '60px' }}>
            <NavigationBar /> {/* 🔥 NAVIGÁCIÓS SÁV */}

            <Box sx={{ padding: 3 }}>
                <CharacterHeader character={character} onUpdate={updateCharacter} />

                {/* Lapfülek */}
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab label="Statisztikák" />
                    <Tab label="Inventory" />
                    <Tab label="Varázslatok" />
                    <Tab label="Képességek" />
                    <Tab label="Háttértörténet" />
                </Tabs>

                {/* Tartalom */}
                {activeTab === 0 && <StatsTab character={character} onUpdate={updateCharacter} />}
                {activeTab === 1 && <InventoryTab character={character} onUpdate={updateCharacter} />}
                {activeTab === 2 && <SpellsTab character={character} onUpdate={updateCharacter} />}
                {activeTab === 3 && <SkillsTab character={character} />}
                {activeTab === 4 && <BackstoryTab character={character} onUpdate={updateCharacter} />}
            </Box>
        </Box>
    );
};

export default CharacterSheetPage;
