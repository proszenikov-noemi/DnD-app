import React from 'react';
import NavigationBar from '../../../shared/components/NavigationBar';
import { useCampaign } from '../../../shared/context/CampaignContext';

const ChatPage: React.FC = () => {
    const { campaign, role } = useCampaign();

    return (
        <div className="page-content">
            <NavigationBar />
            <h1>{campaign} kampány - Közös Chat ({role === 'dm' ? 'Dungeon Master' : 'Játékos'})</h1>
            <p>Itt lesz a közös bolt</p>
        </div>
    );
};

export default ChatPage;
