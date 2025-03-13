import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const InventoryTab: React.FC<{ character: any; onUpdate: (newData: any) => void }> = ({ character, onUpdate }) => {
    const [newItem, setNewItem] = useState('');

    const addItem = () => {
        if (!newItem.trim()) return;
        const updatedCharacter = { ...character, inventory: [...character.inventory, newItem] };
        onUpdate(updatedCharacter);
        setNewItem('');
    };

    return (
        <Box>
            <Typography variant="h6">Inventory</Typography>
            {character.inventory.map((item: string, index: number) => (
                <Typography key={index}>- {item}</Typography>
            ))}

            <TextField
                label="Új tárgy"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                fullWidth
            />
            <Button onClick={addItem}>Hozzáadás</Button>
        </Box>
    );
};

export default InventoryTab;
