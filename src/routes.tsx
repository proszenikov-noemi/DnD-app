import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./modules/Auth/LoginPage";
import RegisterPage from "./modules/Auth/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CharacterPage from "./pages/CharacterSheetPage";
import InventoryPage from "./pages/InventoryPage";
import CombatPage from "./pages/CombatPage";
import TeamPage from "./pages/TeamPage";
import MapPage from "./modules/MapTracker/MapPage"; // ✅ Új Térkép oldal

interface AppRoutesProps {
  user: any; // 🔹 Bejelentkezési állapot figyelése
}

const AppRoutes: React.FC<AppRoutesProps> = ({ user }) => {
  return (
    <Routes>
      {/* 🔹 Publikus oldalak (Bejelentkezés nélkül elérhetőek) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 🔹 Privát oldalak (Csak bejelentkezett felhasználóknak) */}
      <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/character-sheet" element={user ? <CharacterPage /> : <Navigate to="/login" />} />
      <Route path="/inventory" element={user ? <InventoryPage /> : <Navigate to="/login" />} />
      <Route path="/combat" element={user ? <CombatPage /> : <Navigate to="/login" />} />
      <Route path="/team" element={user ? <TeamPage /> : <Navigate to="/login" />} />
      <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" />} /> {/* ✅ Új térkép oldal */}
    </Routes>
  );
};

export default AppRoutes;
