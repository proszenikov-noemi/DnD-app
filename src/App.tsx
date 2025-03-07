import React from 'react';
import { CampaignProvider } from './shared/context/CampaignContext';
import AppRoutes from './routes';

const App: React.FC = () => {
    return (
        <CampaignProvider>
            <AppRoutes />
        </CampaignProvider>
    );
};

export default App;
