import React, { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import AppRoutes from "./routes";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import NavigationBar from "./components/NavigationBar"; // ✅ NAVBAR BEHÚZÁSA
import { useLocation } from "react-router-dom"; // ✅ AKTUÁLIS OLDAL FIGYELÉSE

const App: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // 📌 Az aktuális útvonal követése

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

  // 🔹 Ellenőrizzük, hogy a user be van-e jelentkezve, és melyik oldalon vagyunk
  const hideNavbarRoutes = ["/", "/login", "/register"]; // 📌 Ezeken az oldalakon nincs navbar
  const shouldShowNavbar = user && !hideNavbarRoutes.includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {shouldShowNavbar && <NavigationBar user={user} />} {/* ✅ NAVIGÁCIÓS SÁV CSAK BEJELENTKEZÉS UTÁN */}
      <AppRoutes user={user} /> {/* ✅ Az oldalak megjelenítése */}
    </ThemeProvider>
  );
};

export default App;
