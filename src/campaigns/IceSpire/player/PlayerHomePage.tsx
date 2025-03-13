import React from 'react';
import { useCampaign } from '../../../shared/context/CampaignContext';
import NavigationBar from '../../../shared/components/NavigationBar';

const IcespirePlayerHomePage: React.FC = () => {
    const { campaign } = useCampaign();

    return (
        <div className="page-content">
            <NavigationBar />
            <h1>Üdvözöllek az {campaign} kampányban - Játékos Nézet!</h1>
        </div>
    );
};

export default IcespirePlayerHomePage;
