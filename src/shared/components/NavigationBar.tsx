import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCampaign } from '../../shared/context/CampaignContext';
import { auth, db } from '../utils/firebase'; // Firebase szükséges a kampányadatok lekéréséhez
import { doc, getDoc } from 'firebase/firestore';
import { icespireRoutes } from '../../campaigns/IceSpire/Config';
import { witchlightRoutes } from '../../campaigns/WitchLight/Config';
import campaigns from '../context/Campaign';

interface SubMenuItem {
    label: string;
    path: string;
}

interface MenuItem {
    label: string;
    path?: string;
    submenu?: SubMenuItem[];
    role: string;
}

const getCampaignRoutes = (campaign: string): MenuItem[] => {
    switch (campaign.toLowerCase()) {
        case 'icespire':
            return icespireRoutes;
        case 'witchlight':
            return witchlightRoutes;
        default:
            return [];
    }
};

const NavigationBar: React.FC = () => {
    const { campaign, role, setCampaign, setRole } = useCampaign();
    const navigate = useNavigate();

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isCampaignMenuOpen, setIsCampaignMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const campaignRoutes = getCampaignRoutes(campaign);

    const handleCampaignSwitch = async (newCampaign: string) => {
        if (newCampaign === campaign) return; // Ha ugyanaz a kampány, nem kell váltani

        const user = auth.currentUser;
        if (!user) {
            alert('Nincs bejelentkezett felhasználó.');
            return;
        }

        const campaignRef = doc(db, 'campaigns', newCampaign.toLowerCase());
        const campaignSnap = await getDoc(campaignRef);

        if (campaignSnap.exists()) {
            const campaignData = campaignSnap.data();
            const player = campaignData.players.find((p: any) => p.uid === user.uid);

            if (player) {
                setCampaign(newCampaign);
                setRole(player.role);

                // Automatikus navigáció az új kampány megfelelő oldalára
                if (player.role === 'dm') {
                    navigate(`/${newCampaign.toLowerCase()}-dm-home`);
                } else {
                    navigate(`/${newCampaign.toLowerCase()}-player-home`);
                }
            } else {
                alert('Ebben a kampányban nem vagy beállítva játékosként.');
            }
        } else {
            alert('Nem található a kiválasztott kampány.');
        }

        setIsCampaignMenuOpen(false);
    };

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/');
    };

    const toggleDropdown = (label: string) => {
        setOpenDropdown(openDropdown === label ? null : label);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setOpenDropdown(null);
    };

    const toggleCampaignMenu = () => {
        setIsCampaignMenuOpen(!isCampaignMenuOpen);
    };

    if (!campaign) {
        return <div>Hiba: Nincs kiválasztott kampány!</div>;
    }

    if (!role) {
        return <div>Hiba: Nincs beállított szerepkör!</div>;
    }

    const filteredLinks = campaignRoutes.filter(route => route.role === role || route.role === 'both');

    return (
        <nav style={{ padding: '10px', borderBottom: '1px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Kampányválasztó dropdown a bal oldalon */}
            <div style={{ position: 'relative' }}>
                <button onClick={toggleCampaignMenu}>
                    Kampány: {campaign} ▼
                </button>
                {isCampaignMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        background: 'white',
                        border: '1px solid black',
                        zIndex: 1000
                    }}>
                        {campaigns.map(camp => (
                            <button
                                key={camp.id}
                                onClick={() => handleCampaignSwitch(camp.id)}
                                style={{ display: 'block', padding: '5px 10px', textAlign: 'left', width: '100%' }}
                            >
                                {camp.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Navigációs menü */}
            <div>
                {isMobile ? (
                    <>
                        <button onClick={toggleMenu} style={{ marginLeft: '10px' }}>☰</button>
                        {isMenuOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '50px',
                                right: 0,
                                width: '100%',
                                background: 'white',
                                border: '1px solid black',
                                zIndex: 1000
                            }}>
                                {filteredLinks.map((link) => (
                                    link.submenu ? (
                                        <div key={link.label}>
                                            <button onClick={() => toggleDropdown(link.label)} style={{ width: '100%', textAlign: 'left' }}>
                                                {link.label}
                                            </button>
                                            {openDropdown === link.label && (
                                                <div style={{ paddingLeft: '15px' }}>
                                                    {link.submenu.map(subLink => (
                                                        <Link
                                                            key={subLink.path}
                                                            to={subLink.path}
                                                            onClick={toggleMenu}
                                                            style={{ display: 'block', padding: '5px 0' }}
                                                        >
                                                            {subLink.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link key={link.path} to={link.path!} onClick={toggleMenu} style={{ display: 'block', padding: '5px 0' }}>
                                            {link.label}
                                        </Link>
                                    )
                                ))}
                                <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left' }}>Kijelentkezés</button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {filteredLinks.map((link) => (
                            link.submenu ? (
                                <div key={link.label} style={{ display: 'inline-block', position: 'relative', marginRight: '10px' }}>
                                    <button onClick={() => toggleDropdown(link.label)}>{link.label}</button>
                                    {openDropdown === link.label && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid black' }}>
                                            {link.submenu.map(subLink => (
                                                <Link key={subLink.path} to={subLink.path} onClick={() => setOpenDropdown(null)}>{subLink.label}</Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link key={link.path} to={link.path!} style={{ marginRight: '10px' }}>{link.label}</Link>
                            )
                        ))}
                        <button onClick={handleLogout}>Kijelentkezés</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavigationBar;
