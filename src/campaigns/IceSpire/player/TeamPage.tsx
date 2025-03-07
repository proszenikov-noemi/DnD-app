import React from 'react';
import NavigationBar from '../../../shared/components/NavigationBar';
import { useCampaign } from '../../../shared/context/CampaignContext';

const TeamPage: React.FC = () => {
    const { campaign, role } = useCampaign();

    return (
        <div>
            <NavigationBar />
            <h1>{campaign} kampány - Csapat oldal ({role === 'dm' ? 'Dungeon Master' : 'Játékos'})</h1>
            <p>Itt lesz majd a csapattagok listája és az elérhető karakterinformációk.</p>
        </div>
    );
};

export default TeamPage;
