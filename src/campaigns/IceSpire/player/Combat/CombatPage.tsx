import React from 'react';
import NavigationBar from '../../../../shared/components/NavigationBar';
import { useCampaign } from '../../../../shared/context/CampaignContext';

const CombatPage: React.FC = () => {
    const { campaign, role } = useCampaign();

    return (
        <div className="page-content">
            <NavigationBar />
            <h1>{campaign} kampány - Harc oldal ({role === 'dm' ? 'Dungeon Master' : 'Játékos'})</h1>
            <p>Itt jelenik majd meg a harcrendszer, de ez még csak egy placeholder oldal.</p>
        </div>
    );
};

export default CombatPage;
