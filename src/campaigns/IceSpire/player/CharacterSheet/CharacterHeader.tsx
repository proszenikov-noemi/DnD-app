import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar, Switch, Grid, FormControlLabel } from '@mui/material';

// 🔥 Alapértelmezett profilkép
const DEFAULT_PROFILE_PIC = "https://via.placeholder.com/100";

const CharacterHeader: React.FC<{ character: any; onUpdate: (newData: any) => void }> = ({ character, onUpdate }) => {
    const [editing, setEditing] = useState(false);
    const [editedCharacter, setEditedCharacter] = useState({ ...character });

    // 🔥 Ha `deathSaves` nincs, alapértékeket kap
    const deathSaves = character.deathSaves || { successes: 0, failures: 0 };

    const handleEditChange = (field: string, value: any) => {
        setEditedCharacter(prev => ({ ...prev, [field]: value }));
    };

    const toggleHeroicInspiration = () => {
        setEditedCharacter(prev => ({ ...prev, heroicInspiration: !prev.heroicInspiration }));
    };

    const saveChanges = () => {
        onUpdate(editedCharacter);
        setEditing(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#333', // 🔥 Sötétebb háttér a jobb kontraszthoz
                color: '#fff', // 🔥 Fehér szöveg a jobb olvashatóságért
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '15px',
                boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.2)', // 🔥 Enyhe árnyék
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
                        boxShadow: character.heroicInspiration ? '0px 0px 12px gold' : 'none',
                        transition: "all 0.3s",
                    }}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={editedCharacter.heroicInspiration || false}
                            onChange={toggleHeroicInspiration}
                        />
                    }
                    label="Heroic Inspiration"
                    sx={{ color: '#fff' }} // 🔥 Fehér szöveg a kapcsoló mellett
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
                    <Typography sx={{ fontSize: '1rem' }}>
                        <strong>Halálmentő dobások:</strong> {deathSaves.successes}/3 siker, {deathSaves.failures}/3 hiba
                    </Typography>
                    <Button onClick={() => setEditing(true)} variant="contained" sx={{ marginTop: '15px' }}>Szerkesztés</Button>
                </>
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField label="Név" value={editedCharacter.name} onChange={(e) => handleEditChange('name', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Faj" value={editedCharacter.race} onChange={(e) => handleEditChange('race', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Kaszt" value={editedCharacter.class} onChange={(e) => handleEditChange('class', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Szint" type="number" value={editedCharacter.level} onChange={(e) => handleEditChange('level', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Max HP" type="number" value={editedCharacter.maxHp} onChange={(e) => handleEditChange('maxHp', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Aktuális HP" type="number" value={editedCharacter.hp} onChange={(e) => handleEditChange('hp', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Temp HP" type="number" value={editedCharacter.tempHp} onChange={(e) => handleEditChange('tempHp', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="AC" type="number" value={editedCharacter.ac} onChange={(e) => handleEditChange('ac', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Initiative" type="number" value={editedCharacter.initiative} onChange={(e) => handleEditChange('initiative', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="XP" type="number" value={editedCharacter.xp} onChange={(e) => handleEditChange('xp', e.target.value)} fullWidth />
                    </Grid>
                    <Button onClick={saveChanges} variant="contained" sx={{ marginTop: '15px' }}>Mentés</Button>
                    <Button onClick={() => setEditing(false)} variant="outlined" sx={{ marginTop: '15px', marginLeft: '10px' }}>Mégse</Button>
                </Grid>
            )}
        </Box>
    );
};

export default CharacterHeader;
