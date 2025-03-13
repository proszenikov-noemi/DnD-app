import React, { useState, useEffect } from 'react';
import { useCampaign } from '../../../../shared/context/CampaignContext';
import { db, auth } from '../../../../shared/utils/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import NavigationBar from '../../../../shared/components/NavigationBar'; // 🔥 NAVBAR IMPORT
import { defaultCharacter } from '../../../../shared/utils/defaultCharacter';
import CharacterHeader from './CharacterHeader';
import StatsTab from './StatsTab';
import InventoryTab from './InventoryTab';
import SpellsTab from './SpellsTab';
import SkillsTab from './SkillsTab';
import BackstoryTab from './BackstoryTab';
import { Box, Tab, Tabs, Typography } from '@mui/material';

const CharacterSheetPage: React.FC = () => {
    const { campaign } = useCampaign();
    const user = auth.currentUser;
    const [character, setCharacter] = useState<any>(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!user || !campaign) return;

        const fetchCharacter = async () => {
            const charRef = doc(db, 'campaigns', campaign, 'characters', user.uid);
            const charSnap = await getDoc(charRef);

            if (charSnap.exists()) {
                let characterData = charSnap.data();

                // 🔥 Ha a `skills` vagy `savingThrows` hiányzik, hozzáadjuk Firestore-ban!
                let updatedFields: any = {};
                if (!characterData.skills) updatedFields.skills = defaultCharacter.skills;
                if (!characterData.savingThrows) updatedFields.savingThrows = defaultCharacter.savingThrows;

                if (Object.keys(updatedFields).length > 0) {
                    await updateDoc(charRef, updatedFields);
                    characterData = { ...characterData, ...updatedFields };
                }

                setCharacter(characterData);
            } else {
                // 🔥 Ha a karakter nem létezik, létrehozzuk az alapértelmezett karaktert
                await setDoc(charRef, defaultCharacter);
                setCharacter(defaultCharacter);
            }
        };

        fetchCharacter();
    }, [user, campaign]);

    const updateCharacter = async (newData: any) => {
        if (!user || !campaign) return;

        const charRef = doc(db, 'campaigns', campaign, 'characters', user.uid);
        await updateDoc(charRef, newData);
        setCharacter(newData);
    };

    if (!character) return <Typography sx={{ textAlign: 'center', marginTop: '20px' }}>Karakter betöltése...</Typography>;

    return (
        <Box sx={{ paddingTop: '60px' }}> {/* 🔥 NAVBAR HELYET HAGYUNK */}
            <NavigationBar /> {/* 🔥 NAVIGÁCIÓS SÁV */}

            <Box sx={{ padding: 3 }}>
                <CharacterHeader character={character} />

                {/* Lapfülek */}
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab label="Statisztikák" />
                    <Tab label="Inventory" />
                    <Tab label="Varázslatok" />
                    <Tab label="Képességek" />
                    <Tab label="Háttértörténet" />
                </Tabs>

                {/* Tartalom */}
                {activeTab === 0 && <StatsTab character={character} />}
                {activeTab === 1 && <InventoryTab character={character} onUpdate={updateCharacter} />}
                {activeTab === 2 && <SpellsTab character={character} onUpdate={updateCharacter} />}
                {activeTab === 3 && <SkillsTab character={character} />}
                {activeTab === 4 && <BackstoryTab character={character} onUpdate={updateCharacter} />}
            </Box>
        </Box>
    );
};

export default CharacterSheetPage;
