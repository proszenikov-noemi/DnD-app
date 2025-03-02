import React, { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import AppRoutes from "./routes";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import NavigationBar from "./components/NavigationBar";
import { useLocation, Routes, Route } from "react-router-dom";
import { CampaignProvider } from "./context/CampaignContext";
import GlobalBackground from "./components/GlobalBackground";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const App: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px", fontSize: "20px" }}>
        Betöltés...
      </div>
    );
  }

  const hideNavbarRoutes = ["/", "/login", "/register", "/admin-login"];
  const shouldShowNavbar = user && !hideNavbarRoutes.includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CampaignProvider>
        <GlobalBackground />
        {shouldShowNavbar && <NavigationBar user={user} />}

        <Routes>
          {/* Alap user route-ok */}
          <Route path="/*" element={<AppRoutes user={user} />} />

          {/* Admin speciális route-ok */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </CampaignProvider>
    </ThemeProvider>
  );
};

export default App;
