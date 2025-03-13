import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const SpellsTab: React.FC<{ character: any; onUpdate: (newData: any) => void }> = ({ character, onUpdate }) => {
    const [newSpell, setNewSpell] = useState('');

    const addSpell = () => {
        if (!newSpell.trim()) return;
        const updatedCharacter = { ...character, spells: [...character.spells, newSpell] };
        onUpdate(updatedCharacter);
        setNewSpell('');
    };

    return (
        <Box>
            <Typography variant="h6">Varázslatok</Typography>
            {character.spells.map((spell: string, index: number) => (
                <Typography key={index}>- {spell}</Typography>
            ))}

            <TextField
                label="Új varázslat"
                value={newSpell}
                onChange={(e) => setNewSpell(e.target.value)}
                fullWidth
            />
            <Button onClick={addSpell}>Hozzáadás</Button>
        </Box>
    );
};

export default SpellsTab;
