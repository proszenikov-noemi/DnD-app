import React, { useState, useEffect } from 'react';
import { useCampaign } from '../../../../shared/context/CampaignContext';
import { db } from '../../../../shared/utils/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { MenuItem, Select, TextField, Button, Box, Typography } from '@mui/material';

const HeroesTab: React.FC<{ onAddHero: (hero: any) => void }> = ({ onAddHero }) => {
    const { campaign } = useCampaign();
    const [heroes, setHeroes] = useState<any[]>([]);
    const [selectedHeroId, setSelectedHeroId] = useState<string>('');
    const [newHero, setNewHero] = useState<any>({ name: '', ac: '', hp: '', initiative: '' });

    useEffect(() => {
        if (!campaign) return;

        const fetchHeroes = async () => {
            console.log(`📥 Kampány karaktereinek betöltése: ${campaign}`);
            const charactersRef = collection(db, 'campaigns', campaign, 'characters');

            try {
                const characterDocs = await getDocs(charactersRef);
                const characters = characterDocs.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                console.log("✅ Karakterek betöltve:", characters);
                setHeroes(characters);
            } catch (error) {
                console.error("❌ Hiba történt a karakterek lekérésekor:", error);
            }
        };

        fetchHeroes();
    }, [campaign]);

    const handleAddHero = () => {
        if (!newHero.initiative) {
            alert("📌 Kérlek, add meg az initiative értéket!");
            return;
        }

        let heroToAdd;

        if (selectedHeroId === 'custom') {
            if (!newHero.name || !newHero.ac || !newHero.hp) {
                alert("📌 Kérlek, töltsd ki az összes mezőt az új hősnél!");
                return;
            }

            heroToAdd = {
                id: `custom-${Date.now()}`, // Egyedi azonosító generálása új hősnek
                name: newHero.name,
                ac: Number(newHero.ac),        // 🔥 Most már mindig szám lesz!
                hp: Number(newHero.hp),        // 🔥 Most már mindig szám lesz!
                maxHp: Number(newHero.maxHp),  // 🔥 Most már mindig szám lesz!
                tempHp: Number (newHero.tempHp),
                initiative: parseInt(newHero.initiative, 10)
            };
        } else {
            const selectedHero = heroes.find(hero => hero.id === selectedHeroId);
            if (selectedHero) {
                heroToAdd = {
                    id: selectedHero.id,
                    name: selectedHero.name,
                    ac: Number(selectedHero.ac),        // 🔥 Most már mindig szám lesz!
                    hp: Number(selectedHero.hp),        // 🔥 Most már mindig szám lesz!
                    maxHp: Number(selectedHero.maxHp),  // 🔥 Most már mindig szám lesz!
                    tempHp: Number(selectedHero.tempHp),
                    initiative: parseInt(newHero.initiative, 10)
                };
            }
        }

        if (heroToAdd) {
            console.log("📝 Hős hozzáadása a harci listához:", heroToAdd);
            onAddHero(heroToAdd);
        }

        // 📌 Mezők kiürítése hozzáadás után
        setNewHero({ name: '', ac: '', hp: '', initiative: '' });
        setSelectedHeroId('');
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6">Hős hozzáadása</Typography>
            <Select
                fullWidth
                value={selectedHeroId}
                onChange={(e) => {
                    setSelectedHeroId(e.target.value);
                    if (e.target.value !== "custom") {
                        const selectedHero = heroes.find(hero => hero.id === e.target.value);
                        if (selectedHero) {
                            setNewHero({
                                name: selectedHero.name,
                                ac: selectedHero.ac,
                                hp: selectedHero.hp,
                                initiative: ''  // Az initiative-t mindig a játékos adja meg!
                            });
                        }
                    } else {
                        setNewHero({ name: '', ac: '', hp: '', initiative: '' });
                    }
                }}
                displayEmpty
                sx={{ marginBottom: 2 }}
            >
                <MenuItem value="" disabled>Válassz egy hőst...</MenuItem>
                {heroes.map(hero => (
                    <MenuItem key={hero.id} value={hero.id}>
                        {hero.name} (AC: {hero.ac}, HP: {hero.hp})
                    </MenuItem>
                ))}
                <MenuItem value="custom">➕ Új hős létrehozása</MenuItem>
            </Select>

            {/* Initiative mező mindig látszik, ha karakter van kiválasztva */}
            {selectedHeroId && (
                <TextField 
                    fullWidth 
                    label="Initiative" 
                    value={newHero.initiative} 
                    onChange={(e) => setNewHero({ ...newHero, initiative: e.target.value })} 
                    sx={{ marginBottom: 2 }} 
                />
            )}

            {/* Csak ha az új karaktert választjuk, akkor jelennek meg az extra mezők */}
            {selectedHeroId === 'custom' && (
                <>
                    <TextField fullWidth label="Név" value={newHero.name} onChange={(e) => setNewHero({ ...newHero, name: e.target.value })} sx={{ marginBottom: 2 }} />
                    <TextField fullWidth label="AC" value={newHero.ac} onChange={(e) => setNewHero({ ...newHero, ac: e.target.value })} sx={{ marginBottom: 2 }} />
                    <TextField fullWidth label="HP" value={newHero.hp} onChange={(e) => setNewHero({ ...newHero, hp: e.target.value })} sx={{ marginBottom: 2 }} />
                </>
            )}

            <Button fullWidth variant="contained" onClick={handleAddHero}>Hős hozzáadása</Button>
        </Box>
    );
};

export default HeroesTab;
