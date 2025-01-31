import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './modules/Auth/LoginPage';
import RegisterPage from './modules/Auth/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CharacterSheetPage from './pages/CharacterSheetPage';
import InventoryPage from './pages/InventoryPage';
import CombatPage from './pages/CombatPage'; // ÚJ!

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/character-sheet" element={<CharacterSheetPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/combat" element={<CombatPage />} /> {/* 🔹 ÚJ */}
    </Routes>
  );
};

export default AppRoutes;
