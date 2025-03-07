import React from 'react';
import { useCampaign } from '../../../shared/context/CampaignContext';
import NavigationBar from '../../../shared/components/NavigationBar';

const WitchlightDmDashboard: React.FC = () => {
    const { campaign } = useCampaign();

    return (
        <div>
            <NavigationBar />
            <h1>Üdvözöllek az {campaign} kampányban - DM Nézet!</h1>
            <p>beállítások menupont</p>
        </div>
    );
};

export default WitchlightDmDashboard;
