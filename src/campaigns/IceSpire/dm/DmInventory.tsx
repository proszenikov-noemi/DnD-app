import React from 'react';
import { useCampaign } from '../../../shared/context/CampaignContext';
import NavigationBar from '../../../shared/components/NavigationBar';

const WitchlightDmDashboard: React.FC = () => {
    const { campaign } = useCampaign();

    return (
        <div>
            <NavigationBar />
            <h1>Üdvözöllek az {campaign} kampányban - DM Nézet!</h1>
            <p>Itt lesz a kampáynban megszerezjetö kincsejk és tárgyak listája és be lehet jeolni hogy esetleg egy játékos megszerzte-e már</p>
        </div>
    );
};

export default WitchlightDmDashboard;
