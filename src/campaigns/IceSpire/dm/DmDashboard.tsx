import React from 'react';
import { useCampaign } from '../../../shared/context/CampaignContext';
import NavigationBar from '../../../shared/components/NavigationBar';


const IcespireDmDashboard: React.FC = () => {
    const { campaign } = useCampaign();

    return (
        <div className="page-content">
            <NavigationBar />
            <h1>Üdvözöllek az {campaign} kampányban - DM Nézet!</h1>
        </div>
    );
};

export default IcespireDmDashboard;
