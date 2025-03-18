import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

// 🔥 Fix stat sorrend (D&D 2024 karakterlap alapján)
const STAT_ORDER = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

// 🔥 Modifier kiszámítása (D&D 2024 szabályok szerint)
const calculateModifier = (score: number, bonus: number = 0) => Math.floor((score + bonus - 10) / 2);

const StatsTab: React.FC<{ character: any; onUpdate: (newData: any) => void }> = ({ character, onUpdate }) => {
    const [editing, setEditing] = useState(false);
    const [stats, setStats] = useState({ ...character.stats });
    const [customBonuses, setCustomBonuses] = useState(character.customBonuses || {}); // Egyéni módosítók
    const [savingThrowAdvantage, setSavingThrowAdvantage] = useState(character.savingThrowAdvantage || {}); // Mentődobás előnyök

    const handleChange = (statName: string, value: string) => {
        const numValue = parseInt(value, 10) || 0;
        setStats((prevStats: any) => ({ ...prevStats, [statName]: numValue }));
    };

    const handleBonusChange = (statName: string, value: string) => {
        const numValue = parseInt(value, 10) || 0;
        setCustomBonuses((prevBonuses: any) => ({ ...prevBonuses, [statName]: numValue }));
    };

    const toggleSavingThrowAdvantage = (statName: string) => {
        setSavingThrowAdvantage((prev) => ({
            ...prev,
            [statName]: !prev[statName],
        }));
    };

    const incrementStat = (statName: string) => {
        setStats((prevStats: any) => ({ ...prevStats, [statName]: prevStats[statName] + 1 }));
    };

    const decrementStat = (statName: string) => {
        setStats((prevStats: any) => ({ ...prevStats, [statName]: Math.max(0, prevStats[statName] - 1) }));
    };

    const saveChanges = async () => {
        const updatedCharacter = {
            ...character,
            stats,
            customBonuses,
            savingThrowAdvantage,
        };
        await onUpdate(updatedCharacter);
        setStats(updatedCharacter.stats);
        setCustomBonuses(updatedCharacter.customBonuses);
        setSavingThrowAdvantage(updatedCharacter.savingThrowAdvantage);
        setEditing(false);
    };

    return (
        <Box>
            <Typography variant="h6">Karakter Statisztikák</Typography>

            {!editing ? (
                <Grid container spacing={2}>
                    {STAT_ORDER.map((stat) => (
                        <Grid item xs={12} key={stat}>
                            <Typography>
                                <strong>{stat.toUpperCase()}:</strong> {stats[stat] ?? 0} {" "}
                                {customBonuses[stat] ? `(+${customBonuses[stat]})` : ""} {" "}
                                (<span style={{ color: "gray" }}>MOD {calculateModifier(stats[stat] ?? 0, customBonuses[stat] ?? 0)}</span>)
                                {savingThrowAdvantage[stat] && <span style={{ color: "green" }}> (🟢 Mentődobás előny!)</span>}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={2}>
                    {STAT_ORDER.map((stat) => (
                        <Grid item xs={12} key={stat} display="flex" alignItems="center">
                            <IconButton onClick={() => incrementStat(stat)} color="primary">
                                <ArrowUpward />
                            </IconButton>

                            <TextField
                                label={`${stat.toUpperCase()} (dobott érték)`}
                                type="number"
                                value={stats[stat] ?? 0}
                                onChange={(e) => handleChange(stat, e.target.value)}
                                fullWidth
                                sx={{ mx: 2 }}
                            />

                            <IconButton onClick={() => decrementStat(stat)} color="secondary">
                                <ArrowDownward />
                            </IconButton>

                            {/* Egyéni módosító beviteli mező */}
                            <TextField
                                label="Egyéni módosító"
                                type="number"
                                value={customBonuses[stat] ?? 0}
                                onChange={(e) => handleBonusChange(stat, e.target.value)}
                                sx={{ mx: 2, width: "100px" }}
                            />

                            {/* Mentődobás előny checkbox */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={savingThrowAdvantage[stat] ?? false}
                                        onChange={() => toggleSavingThrowAdvantage(stat)}
                                    />
                                }
                                label="Mentődobás előny"
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            <Box mt={2}>
                {!editing ? (
                    <Button variant="contained" color="primary" onClick={() => setEditing(true)}>Szerkesztés</Button>
                ) : (
                    <>
                        <Button variant="contained" color="success" onClick={saveChanges}>Mentés</Button>
                        <Button variant="contained" color="secondary" onClick={() => setEditing(false)} sx={{ ml: 2 }}>Mégse</Button>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default StatsTab;
