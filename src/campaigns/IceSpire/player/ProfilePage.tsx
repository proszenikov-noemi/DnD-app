import React from 'react';
import NavigationBar from '../../../shared/components/NavigationBar';
import { useCampaign } from '../../../shared/context/CampaignContext';

const ProfilePage: React.FC = () => {
    const { campaign, role } = useCampaign();

    return (
        <div className="page-content">
            <NavigationBar />
            <h1>{campaign} kampány - Profil oldal ({role === 'dm' ? 'Dungeon Master' : 'Játékos'})</h1>
            <p>Itt lesz majd a profilod és karaktered információja.</p>
        </div>
    );
};

export default ProfilePage;

