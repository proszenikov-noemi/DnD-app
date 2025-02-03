import React, { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import AppRoutes from "./routes";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import NavigationBar from "./components/NavigationBar"; // ✅ Navigációs sáv importálása

const App: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          fontSize: "20px",
          color: "#fff",
        }}
      >
        Betöltés...
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* ✅ Navigációs sáv csak ha be van jelentkezve */}
      {user && <NavigationBar />}
      <div>
        <AppRoutes user={user} /> {/* ✅ User állapot továbbadása */}
      </div>
    </ThemeProvider>
  );
};

export default App;
