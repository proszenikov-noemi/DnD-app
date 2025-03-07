import React from 'react';
import { useCampaign } from '../../../shared/context/CampaignContext';
import NavigationBar from '../../../shared/components/NavigationBar';

const WitchlightDmDashboard: React.FC = () => {
    const { campaign } = useCampaign();

    return (
        <div>
            <NavigationBar />
            <h1>Üdvözöllek az {campaign} kampányban - DM Nézet!</h1>
            <p>Itt lesz az összes könyv és minden fájl a dmnek a kampányhoz és magárol a dnd játékröl, bárki tölthet majd fel ide ha van hozzá jogosultsága</p>
        </div>
    );
};

export default WitchlightDmDashboard;
