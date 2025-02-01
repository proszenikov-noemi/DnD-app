import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./modules/Auth/LoginPage";
import RegisterPage from "./modules/Auth/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CharacterSheetPage from "./pages/CharacterSheetPage";
import InventoryPage from "./pages/InventoryPage";
import CombatPage from "./pages/CombatPage";

interface AppRoutesProps {
  user: any; // 👈 Bejelentkezett felhasználó állapotát megkapja az App.tsx-ből
}

const AppRoutes: React.FC<AppRoutesProps> = ({ user }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* 🔹 Ezek az oldalak csak akkor elérhetőek, ha a user be van jelentkezve */}
      <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/character-sheet" element={user ? <CharacterSheetPage /> : <Navigate to="/login" />} />
      <Route path="/inventory" element={user ? <InventoryPage /> : <Navigate to="/login" />} />
      <Route path="/combat" element={user ? <CombatPage /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
