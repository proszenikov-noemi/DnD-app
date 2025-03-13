import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const BackstoryTab: React.FC<{ character: any; onUpdate: (newData: any) => void }> = ({ character, onUpdate }) => {
    const [backstory, setBackstory] = useState(character.backstory || '');

    const saveBackstory = () => {
        const updatedCharacter = { ...character, backstory };
        onUpdate(updatedCharacter);
    };

    return (
        <Box>
            <Typography variant="h6">Karakter Háttértörténete</Typography>
            <TextField
                label="Írd le a karaktered múltját és fontos eseményeit..."
                multiline
                rows={5}
                value={backstory}
                onChange={(e) => setBackstory(e.target.value)}
                fullWidth
            />
            <Button onClick={saveBackstory}>Mentés</Button>
        </Box>
    );
};

export default BackstoryTab;
