import React from 'react';
import { Box, Typography } from '@mui/material';

const StatsTab: React.FC<{ character: any }> = ({ character }) => {
    return (
        <Box>
            <Typography variant="h6">Erő: {character.stats.STR}</Typography>
            <Typography variant="h6">Ügyesség: {character.stats.DEX}</Typography>
            <Typography variant="h6">Állóképesség: {character.stats.CON}</Typography>
            <Typography variant="h6">Intelligencia: {character.stats.INT}</Typography>
            <Typography variant="h6">Bölcsesség: {character.stats.WIS}</Typography>
            <Typography variant="h6">Karizma: {character.stats.CHA}</Typography>
        </Box>
    );
};

export default StatsTab;
