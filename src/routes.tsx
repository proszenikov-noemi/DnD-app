import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './modules/Auth/LoginPage';
import RegisterPage from './modules/Auth/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CharacterSheetPage from './pages/CharacterSheetPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/character-sheet" element={<CharacterSheetPage />} />
    </Routes>
  );
};

export default AppRoutes;
