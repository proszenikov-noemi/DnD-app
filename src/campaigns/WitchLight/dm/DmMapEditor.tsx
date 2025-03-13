import React from 'react';
import { useCampaign } from '../../../shared/context/CampaignContext';
import NavigationBar from '../../../shared/components/NavigationBar';

const WitchlightDmDashboard: React.FC = () => {
    const { campaign } = useCampaign();

    return (
        <div className="page-content">
            <NavigationBar />
            <h1>Üdvözöllek az {campaign} kampányban - DM Nézet!</h1>
            <p>Itt fogja a dm a térképet elérni, ahol maga is tölthet fel térképet és megadhatja élőben hogy a játékososk mit láthatnak és mit nem a térképen</p>
        </div>
    );
};

export default WitchlightDmDashboard;
