import React from 'react';
import { useCampaign } from '../../../shared/context/CampaignContext';
import NavigationBar from '../../../shared/components/NavigationBar';

const WitchLightPlayerHomePage: React.FC = () => {
    const { campaign } = useCampaign();

    return (
        <div>
            <NavigationBar />
            <h1>Üdvözöllek az {campaign} kampányban - Játékos Nézet!</h1>
        </div>
    );
};

export default WitchLightPlayerHomePage;
