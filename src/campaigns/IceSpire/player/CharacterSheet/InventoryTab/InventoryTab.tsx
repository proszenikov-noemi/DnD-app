import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import ItemsTab from './ItemsTab';
import WeaponsTab from './WeaponsTab';

const InventoryTab: React.FC<{ character: any; onUpdate: (newData: any) => void }> = ({ character, onUpdate }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Tárgyak" />
                <Tab label="Fegyverek" />
            </Tabs>

            {activeTab === 0 && <ItemsTab character={character} onUpdate={onUpdate} />}
            {activeTab === 1 && <WeaponsTab character={character} onUpdate={onUpdate} />}
        </Box>
    );
};

export default InventoryTab;
