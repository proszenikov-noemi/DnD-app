import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar, Switch, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../shared/utils/firebase';

const DEFAULT_PROFILE_PIC = "https://via.placeholder.com/100";

const CharacterHeader: React.FC<{ character: any; onUpdate: (newData: any) => void }> = ({ character, onUpdate }) => {
    const [editing, setEditing] = useState(false);
    const [editedCharacter, setEditedCharacter] = useState({ ...character });

    // 🔥 Ha `deathSaves` nincs, alapértékeket kap
    let deathSaves = character.deathSaves || { successes: [false, false, false], failures: [false, false, false] };

    // 🔥 Ha a Firestore-ból érkező adatok véletlenül nem tömbök, alakítsuk át azokat tömbökké!
    if (!Array.isArray(deathSaves.successes)) {
        deathSaves.successes = [false, false, false];
    }
    if (!Array.isArray(deathSaves.failures)) {
        deathSaves.failures = [false, false, false];
    }

    // 🔥 Firestore mentés
    const saveToFirestore = async (updatedCharacter: any) => {
        if (!character.id) return; // Ha nincs ID, nincs mit menteni

        const charRef = doc(db, "characters", character.id);
        await updateDoc(charRef, updatedCharacter);
    };

    // 🔥 Heroic Inspiration kapcsoló
    const toggleHeroicInspiration = async () => {
        const updatedCharacter = { ...character, heroicInspiration: !character.heroicInspiration };
        onUpdate(updatedCharacter);
        saveToFirestore(updatedCharacter);
    };

    // 🔥 Death Saves kezelése
    const toggleDeathSave = (type: "successes" | "failures", index: number) => {
        const updatedDeathSaves = {
            ...deathSaves,
            [type]: deathSaves[type].map((val: boolean, i: number) => (i === index ? !val : val))
        };

        const updatedCharacter = { ...character, deathSaves: updatedDeathSaves };
        onUpdate(updatedCharacter);
        saveToFirestore(updatedCharacter);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#333',
                color: '#fff',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '15px',
                boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.2)',
            }}
        >
            {/* 🔥 Profilkép és Heroic Inspiration kapcsoló */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    src={character.profilePic || DEFAULT_PROFILE_PIC}
                    sx={{
                        width: 80,
                        height: 80,
                        border: `4px solid ${character.heroicInspiration ? 'gold' : 'gray'}`,
                        boxShadow: character.heroicInspiration ? '0px 0px 15px gold' : 'none',
                        transition: "all 0.3s",
                    }}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={character.heroicInspiration || false}
                            onChange={toggleHeroicInspiration}
                        />
                    }
                    label="Heroic Inspiration"
                    sx={{ color: '#fff' }}
                />
            </Box>

            {!editing ? (
                <>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', marginTop: '10px' }}>{character.name}</Typography>
                    <Typography sx={{ fontSize: '1.1rem' }}>{character.race} - {character.class} (Szint {character.level})</Typography>
                    <Typography sx={{ fontSize: '1rem', marginTop: '8px' }}>
                        <strong>HP:</strong> {character.hp} / {character.maxHp} (Temp: {character.tempHp})
                    </Typography>
                    <Typography sx={{ fontSize: '1rem' }}><strong>AC:</strong> {character.ac} | <strong>Initiative:</strong> {character.initiative}</Typography>
                    <Typography sx={{ fontSize: '1rem', marginBottom: '10px' }}><strong>Állapotok:</strong> {character.conditions?.join(", ") || "Nincs"}</Typography>
                    <Typography sx={{ fontSize: '1rem' }}><strong>Háttér:</strong> {character.background} | <strong>Jellem:</strong> {character.alignment}</Typography>
                    <Typography sx={{ fontSize: '1rem', marginBottom: '10px' }}><strong>XP:</strong> {character.xp}</Typography>

                    {/* 🔥 Halálmentő dobások – Pipálható rendszer */}
                    <Typography sx={{ fontSize: '1rem', marginBottom: '10px' }}><strong>Halálmentő dobások:</strong></Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography>Sikerek:</Typography>
                        {deathSaves.successes.map((checked: boolean, index: number) => (
                            <Checkbox key={index} checked={checked} onChange={() => toggleDeathSave("successes", index)} />
                        ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography>Hibák:</Typography>
                        {deathSaves.failures.map((checked: boolean, index: number) => (
                            <Checkbox key={index} checked={checked} onChange={() => toggleDeathSave("failures", index)} />
                        ))}
                    </Box>

                    <Button onClick={() => setEditing(true)} variant="contained" sx={{ marginTop: '15px' }}>Szerkesztés</Button>
                </>
            ) : (
                <>
                    <TextField label="Név" value={editedCharacter.name} onChange={(e) => onUpdate({ ...character, name: e.target.value })} fullWidth />
                    <Button onClick={saveToFirestore} variant="contained" sx={{ marginTop: '15px' }}>Mentés</Button>
                    <Button onClick={() => setEditing(false)} variant="outlined" sx={{ marginTop: '15px', marginLeft: '10px' }}>Mégse</Button>
                </>
            )}
        </Box>
    );
};

export default CharacterHeader;
