import React, { createContext, useContext, useState, useEffect } from 'react';

interface CampaignContextType {
    campaign: string;
    setCampaign: (campaign: string) => void;
    role: string;
    setRole: (role: string) => void;
}

const CampaignContext = createContext<CampaignContextType>({
    campaign: '',
    setCampaign: () => {},
    role: '',
    setRole: () => {},
});

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [campaign, setCampaignState] = useState<string>(localStorage.getItem('currentCampaign') || '');
    const [role, setRoleState] = useState<string>(localStorage.getItem('currentRole') || '');

    const setCampaign = (newCampaign: string) => {
        setCampaignState(newCampaign);
        localStorage.setItem('currentCampaign', newCampaign);
    };

    const setRole = (newRole: string) => {
        setRoleState(newRole);
        localStorage.setItem('currentRole', newRole);
    };

    // Plusz biztonsági lépés - figyelje, ha localStorage megváltozik (pl. kampányváltás után)
    useEffect(() => {
        const checkStoredValues = () => {
            const savedCampaign = localStorage.getItem('currentCampaign') || '';
            const savedRole = localStorage.getItem('currentRole') || '';
            if (savedCampaign !== campaign) setCampaignState(savedCampaign);
            if (savedRole !== role) setRoleState(savedRole);
        };

        // Ezt egyszer az elején lefuttatjuk
        checkStoredValues();

        // És figyelünk a storage eseményre (pl. másik tab váltáskor)
        window.addEventListener('storage', checkStoredValues);

        return () => {
            window.removeEventListener('storage', checkStoredValues);
        };
    }, [campaign, role]);

    return (
        <CampaignContext.Provider value={{ campaign, setCampaign, role, setRole }}>
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaign = () => useContext(CampaignContext);
