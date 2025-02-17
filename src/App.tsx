import React, { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import AppRoutes from "./routes";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import NavigationBar from "./components/NavigationBar"; 
import { useLocation } from "react-router-dom"; 
import { CampaignProvider } from "./context/CampaignContext"; 
import GlobalBackground from "./components/GlobalBackground"; // 🔹 Háttér beillesztése

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
    return <div style={{ textAlign: "center", padding: "50px", fontSize: "20px" }}>Betöltés...</div>;
  }

  const hideNavbarRoutes = ["/", "/login", "/register"]; 
  const shouldShowNavbar = user && !hideNavbarRoutes.includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CampaignProvider>
        <GlobalBackground /> {/* 🔹 Háttérvideó minden oldalon */}
        {shouldShowNavbar && <NavigationBar user={user} />} 
        <AppRoutes user={user} />
      </CampaignProvider>
    </ThemeProvider>
  );
};

export default App;
