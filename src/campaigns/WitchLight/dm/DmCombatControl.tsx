import React from 'react';
import { useCampaign } from '../../../shared/context/CampaignContext';
import NavigationBar from '../../../shared/components/NavigationBar';

const WitchlightDmDashboard: React.FC = () => {
    const { campaign } = useCampaign();

    return (
        <div className="page-content">
            <NavigationBar />
            <h1>Üdvözöllek az {campaign} kampányban - DM Nézet!</h1>
            <p>Itt lesz a harc oldal, a dm szemszögéből. aki több adatot fog látni és irányitani tudja a játékosok mit látnak és mit dinamikusan</p>
        </div>
    );
};

export default WitchlightDmDashboard;
