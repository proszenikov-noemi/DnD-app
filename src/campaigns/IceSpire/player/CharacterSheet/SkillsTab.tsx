import React from 'react';
import { Box, Typography } from '@mui/material';

const SkillsTab: React.FC<{ character: any }> = ({ character }) => {
    if (!character || !character.skills || !character.savingThrows) {
        return <Typography>Adatok betöltése...</Typography>;
    }

    return (
        <Box>
            <Typography variant="h6">🎯 Képességek</Typography>
            {character.skills.length > 0 ? (
                character.skills.map((skill: { name: string; modifier: number }, index: number) => (
                    <Typography key={index}>
                        {skill.name}: {skill.modifier >= 0 ? `+${skill.modifier}` : skill.modifier}
                    </Typography>
                ))
            ) : (
                <Typography>Nincsenek képességadatok.</Typography>
            )}

            <Typography variant="h6" sx={{ marginTop: 2 }}>🛡️ Mentődobások</Typography>
            {character.savingThrows.length > 0 ? (
                character.savingThrows.map((save: { name: string; modifier: number }, index: number) => (
                    <Typography key={index}>
                        {save.name}: {save.modifier >= 0 ? `+${save.modifier}` : save.modifier}
                    </Typography>
                ))
            ) : (
                <Typography>Nincsenek mentődobás adatok.</Typography>
            )}
        </Box>
    );
};

export default SkillsTab;
