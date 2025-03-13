import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCampaign } from '../../shared/context/CampaignContext';
import { auth, db } from '../utils/firebase'; // Firebase szükséges a kampányadatok lekéréséhez
import { doc, getDoc } from 'firebase/firestore';
import { icespireRoutes } from '../../campaigns/IceSpire/Based/Config';
import { witchlightRoutes } from '../../campaigns/WitchLight/Based/Config';
import campaigns from '../context/Campaign';
import { FiLogOut } from 'react-icons/fi';


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

        // 🔥 Kampány-specifikus stílus betöltése
        useEffect(() => {
            const currentCampaignConfig = campaigns.find(c => c.id === campaign);
            
            if (currentCampaignConfig?.themeStylesheet) {
                const existingTheme = document.getElementById('campaign-theme');
        
                if (existingTheme) {
                    document.head.removeChild(existingTheme);
                }
        
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = currentCampaignConfig.themeStylesheet;
                link.id = 'campaign-theme';
                document.head.appendChild(link);
            }
        
            return () => {
                const existingTheme = document.getElementById('campaign-theme');
                if (existingTheme) {
                    document.head.removeChild(existingTheme);
                }
            };
        }, [campaign]);  

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
        <nav className="navigation-bar" >
            {/* Kampányválasztó dropdown a bal oldalon */}
            <div className="campaign-container">
    <button className="campaign-button" onClick={toggleCampaignMenu}>
        <img src={campaigns.find(c => c.id === campaign)?.navImage || '/default.jpg'} 
             alt={campaign} 
             className="campaign-image" />
        <span className="campaign-name">{campaigns.find(c => c.id === campaign)?.name || 'Ismeretlen kampány'}</span> 
    </button>
    {isCampaignMenuOpen && (
        <div className="campaign-dropdown">
            {campaigns.map(camp => (
                <div key={camp.id} className="campaign-option" onClick={() => handleCampaignSwitch(camp.id)}>
                    <div className="campaign-option-content">
                    <img src={camp.navImage} alt={camp.name} className="campaign-dropdown-image" />
                    <span className="campaign-dropdown-name">{camp.name}</span>
                    </div>
                </div>
            ))}
        </div>
    )}
</div>


            {/* Navigációs menü */}
            <div className="navigation-container">
                {isMobile ? (
                    <>
                        <button className="hamburger-menu" onClick={toggleMenu} >☰</button>
                        {isMenuOpen && (
                            <div className="mobile-menu">
                                {filteredLinks.map((link) => (
                                    link.submenu ? (
                                        <div key={link.label} className="mobile-submenu">
                                            <button className="mobile-submenu-button" onClick={() => toggleDropdown(link.label)}>
                                                {link.label}
                                            </button>
                                            {openDropdown === link.label && (
                                                <div className="mobile-submenu-content">
                                                    {link.submenu.map(subLink => (
                                                        <Link
                                                            key={subLink.path}
                                                            className="mobile-submenu-link"
                                                            to={subLink.path}
                                                            onClick={toggleMenu}
                                                        >
                                                            {subLink.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link key={link.path} className="mobile-menu-link" to={link.path!} onClick={toggleMenu}>
                                            {link.label}
                                        </Link>
                                    )
                                ))}
                                <button className="mobile-logout-button" onClick={handleLogout} >Kijelentkezés</button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                    {/* menupontok ikon*/}
                    <div className="menu-container" >
                      <div className="menu" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                       {filteredLinks.map(link => (
                        link.submenu ? (
                            <div key={link.label} className="submenu" >
                                <button className="submenu-button" onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}>
                                   {link.label} ▼
                                </button>
                                {openDropdown === link.label && (
                                    <div className="submenu-content" >
                                        {link.submenu.map(subLink => (
                                            <div key={subLink.path} className="submenu-item" >
                                                <Link className="submenu-link" to={subLink.path}>{subLink.label}</Link>
                                            </div>
                                    ))}
                                </div>
                        )}    
                    </div>
                 ):(
                    <div key={link.path} className="menu-item">
                        <Link className="menu-link" to={link.path || "/"}>{link.label}</Link>
                    </div>
                 )
                    ))}
                </div>
                {/* 🔥 A kijelentkezés ikon most pontosan egy sorban van a többi menüponttal */}
                <div className="logout-container" >
                  <button className="logout-button" onClick={handleLogout} style={{ 
                    background: 'none',
                    border: 'none', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginTop: '-2px' /* 🔥 Enyhén feljebb tolja a logout ikont */
                  }}>
                    <FiLogOut className="logout-icon" size={20} />
                  </button>
                  </div>
                </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavigationBar;
