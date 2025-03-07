import React from 'react';
import { useCampaign } from '../../../shared/context/CampaignContext';
import NavigationBar from '../../../shared/components/NavigationBar';

const WitchlightDmDashboard: React.FC = () => {
    const { campaign } = useCampaign();

    return (
        <div>
            <NavigationBar />
            <h1>Üdvözöllek az {campaign} kampányban - DM Nézet!</h1>
            <p>Itt fogja látni a Dm a kezdöoldalát, ahol nagyban átfogoan össze lesz foglalva a kampánya és a játékosai</p>
        </div>
    );
};

export default WitchlightDmDashboard;
