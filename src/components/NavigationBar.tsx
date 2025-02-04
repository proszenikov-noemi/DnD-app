import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const NavigationBar: React.FC<{ user: any }> = ({ user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

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
    { label: "Térkép", path: "/map" },
  ];

  return (
    <>
      {/* 🔹 Felső navigációs sáv (PC nézet) */}
      {user && (
        <AppBar
          position="fixed"
          sx={{
            background: "linear-gradient(90deg, #4a2c2a, #8a5a44)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
            zIndex: 1100,
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* 🔹 Bejelentkezett felhasználó neve */}
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'MedievalSharp', serif",
                color: "#FFD700",
                textShadow: "2px 2px 5px rgba(0, 0, 0, 0.8)",
              }}
            >
              {user?.displayName || "Kalandor"}
            </Typography>

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
                  backgroundColor: "#d32f2f",
                  transition: "0.3s ease-in-out",
                  "&:hover": { backgroundColor: "#ff6659" },
                }}
              >
                Kijelentkezés
              </Button>
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
      )}

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

          {user && (
            <ListItem button onClick={handleLogout}>
              <ListItemText
                primary="Kijelentkezés"
                sx={{
                  textAlign: "center",
                  fontFamily: "'MedievalSharp', serif",
                  fontWeight: "bold",
                  color: "#FFD700",
                }}
              />
            </ListItem>
          )}
        </List>
      </Drawer>

      {/* 🔹 Tartalomhoz igazítás (hogy ne takarjon ki semmit) */}
      {user && <Box sx={{ height: "64px" }} />} {/* Az AppBar magasságát pótolja */}
    </>
  );
};

export default NavigationBar;
