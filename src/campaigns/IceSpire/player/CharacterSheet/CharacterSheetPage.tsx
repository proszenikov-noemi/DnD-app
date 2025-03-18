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
import { Box, Tab, Tabs, Typography, Select, MenuItem, useMediaQuery, useTheme } from '@mui/material';

const CharacterSheetPage: React.FC = () => {
    const { campaign } = useCampaign();
    const [character, setCharacter] = useState<any>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(auth.currentUser);

    // 📱 Detect Mobile View
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (!user || !campaign) {
            console.warn("⚠️ Nincs bejelentkezett felhasználó vagy kampány, várunk...");
            const interval = setInterval(() => {
                setUser(auth.currentUser);
            }, 500);

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

        const unsubscribe = onSnapshot(charRef, async (charSnap) => {
            if (charSnap.exists()) {
                let characterData = charSnap.data();

                let updatedFields: any = {};
                if (!characterData.skills) updatedFields.skills = defaultCharacter.skills;
                if (!characterData.savingThrows) updatedFields.savingThrows = defaultCharacter.savingThrows;

                if (Object.keys(updatedFields).length > 0) {
                    await updateDoc(charRef, updatedFields);
                    characterData = { ...characterData, ...updatedFields };
                }

                console.log("✅ Karakter betöltve:", characterData);
                
                const updatedCharacterData = {
                    ...characterData,
                    mxHp: characterData.tempHp ? Number(characterData.maxHp) + Number(characterData.tempHp) : Number(characterData.maxHp),
                };
                
                setCharacter(updatedCharacterData);
                
            } else {
                console.warn("⚠️ Nincs még karakter Firestore-ban, létrehozunk egyet...");
                await setDoc(charRef, defaultCharacter);
                setCharacter(defaultCharacter);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, campaign]);

    // ✅ Először definiáljuk ezt a függvényt!
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

    // 🔥 A `updateCharacter` függvény MEGFELELŐEN definiálva van, így most már biztonságosan használhatjuk!
    const tabOptions = [
        { label: "Statisztikák", component: <StatsTab character={character} onUpdate={updateCharacter} /> },
        { label: "Inventory", component: <InventoryTab character={character} onUpdate={updateCharacter} /> },
        { label: "Varázslatok", component: <SpellsTab character={character} onUpdate={updateCharacter} /> },
        { label: "Képességek", component: <SkillsTab character={character} /> },
        { label: "Háttértörténet", component: <BackstoryTab character={character} onUpdate={updateCharacter} /> },
    ];

    if (loading) return <Typography sx={{ textAlign: 'center', marginTop: '20px' }}>🔄 Karakter betöltése...</Typography>;
    if (!character) return <Typography sx={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>🔥 Hiba: Nem sikerült betölteni a karaktert!</Typography>;

    return (
        <Box sx={{ paddingTop: '60px' }}>
            <NavigationBar /> {/* 🔥 NAVIGÁCIÓS SÁV */}

            <Box sx={{ padding: 3 }}>
                <CharacterHeader character={character} onUpdate={updateCharacter} />

                {/* Mobilon legördülő menü, asztali nézetben Tabs */}
                {!isMobile ? (
                    <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                        {tabOptions.map((tab, index) => (
                            <Tab key={index} label={tab.label} />
                        ))}
                    </Tabs>
                ) : (
                    <Select
                        value={activeTab}
                        onChange={(e) => setActiveTab(Number(e.target.value))}
                        fullWidth
                        variant="outlined"
                        sx={{ backgroundColor: '#222', color: '#fff', marginBottom: 2 }}
                    >
                        {tabOptions.map((tab, index) => (
                            <MenuItem key={index} value={index}>
                                {tab.label}
                            </MenuItem>
                        ))}
                    </Select>
                )}

                {/* A kiválasztott fül tartalmának megjelenítése */}
                {tabOptions[activeTab].component}
            </Box>
        </Box>
    );
};

export default CharacterSheetPage;
