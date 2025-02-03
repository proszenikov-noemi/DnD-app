import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

const NavigationBar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Home", path: "/profile" },
    { label: "Karakterlap", path: "/character-sheet" },
    { label: "Inventory", path: "/inventory" },
    { label: "Harc", path: "/combat" },
    { label: "Csapattagok", path: "/team" },
  ];

  return (
    <>
      {/* 🔹 Felső navigációs sáv (PC nézet) */}
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(90deg, #4a2c2a, #8a5a44)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
          zIndex: 1000,
          height: "60px", // 🔹 Magasság meghatározása
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* 🔹 Bejelentkezett felhasználó neve (bal oldal) */}
          {user && (
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'MedievalSharp', serif",
                color: "#FFD700",
                textShadow: "2px 2px 5px rgba(0, 0, 0, 0.8)",
              }}
            >
              {user.displayName || "Kalandor"}
            </Typography>
          )}

          {/* 🔹 Navigációs gombok (PC-n) */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontFamily: "'MedievalSharp', serif",
                  marginLeft: "15px",
                  borderRadius: "10px",
                  padding: "8px 15px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transition: "0.3s ease-in-out",
                  "&:hover": { backgroundColor: "#FFD700", color: "#000" },
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* 🔹 Kijelentkezés gomb (PC) */}
            {user && (
              <Button
                onClick={handleLogout}
                sx={{
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontFamily: "'MedievalSharp', serif",
                  marginLeft: "15px",
                  borderRadius: "10px",
                  padding: "8px 15px",
                  backgroundColor: "#e63946",
                  transition: "0.3s ease-in-out",
                  "&:hover": { backgroundColor: "#c62828" },
                }}
              >
                Kijelentkezés
              </Button>
            )}
          </Box>

          {/* 🔹 Mobilmenü ikon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 🔹 OLDALTALOM LENTEBB TOLÁSA, hogy ne legyen a fejléc mögött */}
      <Box sx={{ marginTop: "60px" }}> {/* 🔹 Annyi px, amennyi a fejléc magassága */}
        {/* 🔹 A gyermekkomponensek (AppRoutes és a többiek) ide kerülnek */}
      </Box>

      {/* 🔹 Mobil oldalsáv (Drawer) */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: "250px",
            background: "#4a2c2a",
            color: "#fff",
          },
        }}
      >
        <List>
          {navItems.map((item) => (
            <ListItem button key={item.path} component={Link} to={item.path} onClick={handleDrawerToggle}>
              <ListItemText primary={item.label} sx={{ textAlign: "center", fontFamily: "'MedievalSharp', serif" }} />
            </ListItem>
          ))}

          {/* 🔹 Kijelentkezés gomb (Mobil) */}
          {user && (
            <ListItem button onClick={handleLogout}>
              <ListItemText
                primary="Kijelentkezés"
                sx={{
                  textAlign: "center",
                  fontFamily: "'MedievalSharp', serif",
                  fontWeight: "bold",
                  color: "#FFD700",
                  backgroundColor: "#e63946",
                  padding: "10px",
                  borderRadius: "10px",
                  "&:hover": { backgroundColor: "#c62828" },
                }}
              />
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default NavigationBar;
