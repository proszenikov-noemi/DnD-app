import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaign } from '../shared/context/CampaignContext';
import { auth, db } from '../shared/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import campaigns from '../shared/context/Campaign';
import './CampaignSelectorPage.css';

const CampaignSelectorPage: React.FC = () => {
    const { setCampaign, setRole } = useCampaign();
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleSelectCampaign = async (campaignId: string) => {
        setCampaign(campaignId);

        if (user) {
            const campaignRef = doc(db, 'campaigns', campaignId);
            const campaignSnap = await getDoc(campaignRef);

            if (campaignSnap.exists()) {
                const campaignData = campaignSnap.data();
                const player = campaignData.players.find((p: any) => p.uid === user.uid);

                if (player) {
                    setRole(player.role);
                    const homePage = player.role === 'dm'
                        ? `/${campaignId}-dm-home`
                        : `/${campaignId}-player-home`;
                    navigate(homePage);
                } else {
                    alert('Nem található szerepkör ebben a kampányban!');
                }
            } else {
                alert('Nem található ilyen kampány!');
            }
        }
    };

    const nextCampaign = () => setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    const prevCampaign = () => setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);

    const getCardStyle = (index: number) => {
        const offset = index - currentIndex;
        const scale = offset === 0 ? 1 : 0.7;
        const opacity = offset === 0 ? 1 : 0.5;
        const zIndex = offset === 0 ? 2 : 1;
        const transform = `translateX(${offset * 300}px) scale(${scale})`;

        return {
            transform,
            opacity,
            zIndex,
        };
    };

    return (
        <div className="campaign-selector-page">
            <h1 className="campaign-title">Válassz Kampányt</h1>
            <div className="campaign-carousel">
                <button className="carousel-button left" onClick={prevCampaign}>❮</button>
                <div className="campaign-track">
                    {campaigns.map((campaign, index) => (
                        <div 
                            key={campaign.id || index}  // 🔥 Egyedi kulcs hozzáadása
                            className="campaign-card" 
                            style={getCardStyle(index)} 
                            onClick={() => handleSelectCampaign(campaign.id)}
                        >
                            {/* Jobb felső sarok - karakter szint */}
                            <div className="card-badge level-badge">
                                <div className="badge-title">Level:</div>
                                <div className="badge-value">{campaign.level}</div>
                            </div>

                            {/* Felső sarok - DM neve */}
                            <div className="card-badge dm-badge">
                                <div className="badge-title">Dungeon Master</div>
                                <div className="badge-value">{campaign.dm}</div>
                            </div>

                            <img src={campaign.coverImage} alt={campaign.name} />
                            <div className="image-overlay">
                                <h3>{campaign.name}</h3>
                                {index === currentIndex && (
                                    <>
                                        <p>{campaign.description}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button className="carousel-button right" onClick={nextCampaign}>❯</button>
            </div>
            <button className="logout-button" onClick={() => auth.signOut().then(() => navigate('/'))}>Kijelentkezés</button>
        </div>
    );
};

export default CampaignSelectorPage;
