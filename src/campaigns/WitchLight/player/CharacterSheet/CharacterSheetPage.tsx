import React from 'react';
import NavigationBar from '../../../../shared/components/NavigationBar';
import { useCampaign } from '../../../../shared/context/CampaignContext';

const CharacterSheetPage: React.FC = () => {
    const { campaign, role } = useCampaign();

    return (
        <div>
            <NavigationBar />
            <h1>{campaign} kampány - Karakterlap ({role === 'dm' ? 'Dungeon Master' : 'Játékos'})</h1>
        </div>
    );
};

export default CharacterSheetPage;
