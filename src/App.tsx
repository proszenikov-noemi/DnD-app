import React, { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import AppRoutes from "./routes";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

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
    return <div style={{ textAlign: "center", padding: "50px", fontSize: "20px" }}>Betöltés...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <AppRoutes user={user} /> {/* ✅ Most az AppRoutes megkapja a user állapotot */}
      </div>
    </ThemeProvider>
  );
};

export default App;
