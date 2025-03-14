import React from 'react';
import NavigationBar from '../../../../shared/components/NavigationBar';
import { useCampaign } from '../../../../shared/context/CampaignContext';

const MapPage: React.FC = () => {
    const { campaign, role } = useCampaign();

    return (
        <div className="page-content">
            <NavigationBar />
            <h1>{campaign} kampány - Térkép oldal ({role === 'dm' ? 'Dungeon Master' : 'Játékos'})</h1>
            <p>Itt lesz majd a térkép nézete, amit a játékosok láthatnak.</p>
        </div>
    );
};

export default MapPage;
