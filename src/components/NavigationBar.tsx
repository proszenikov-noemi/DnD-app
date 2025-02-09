import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
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
    { label: "Harc", path: "/combat" },
    { label: "Csapattagok", path: "/team" },
    { label: "Térkép", path: "/map" },
    { label: "Chat", path: "/chat" }, // Chat menüpont
  ];

  return (
    <>
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

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
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
            <ListItem
              button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
              sx={{
                padding: "10px 20px",
                "&:hover": {
                  backgroundColor: "#FFD700",
                  color: "#000",
                },
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  textAlign: "center",
                  fontFamily: "'MedievalSharp', serif",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              />
            </ListItem>
          ))}

          {user && (
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                padding: "10px 20px",
                "&:hover": {
                  backgroundColor: "#FFD700",
                  color: "#000",
                },
              }}
            >
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

      {user && <Box sx={{ height: "64px" }} />}
    </>
  );
};

export default NavigationBar;
