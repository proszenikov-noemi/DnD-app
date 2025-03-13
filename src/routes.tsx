import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import RolePage from './shared/context/RolePage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CampaignSelectorPage from './pages/CampaignSelectorPage';

// Kampányok dinamikus importja
import { icespireRoutes } from './campaigns/IceSpire/Based/Config';
import { witchlightRoutes } from './campaigns/WitchLight/Based/Config';

// Segédfüggvény a submenu-k kicsomagolására
const flattenRoutes = (routes: any[]) => {
    return routes.flatMap(route => 
        route.submenu ? route.submenu.map((sub: any) => ({ path: sub.path, component: sub.component })) : [route]
    );
};

const RoutesComponent: React.FC = () => {
    const allRoutes = flattenRoutes([...icespireRoutes, ...witchlightRoutes]);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/role" element={<RolePage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/campaign-selector" element={<CampaignSelectorPage />} />

            {/* Kampány-specifikus route-ok dinamikusan, submenu-t is kezelve */}
            {allRoutes.map(({ path, component: Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
        </Routes>
    );
};

export default RoutesComponent;

