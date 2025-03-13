import React from 'react';
import { Box, Typography } from '@mui/material';

const CharacterHeader: React.FC<{ character: any }> = ({ character }) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '15px'
        }}>
            <Typography variant="h4">{character.name}</Typography>
            <Typography>Osztály: {character.class} • Szint: {character.level}</Typography>
            <Typography>HP: {character.hp} • AC: {character.ac}</Typography>
        </Box>
    );
};

export default CharacterHeader;
