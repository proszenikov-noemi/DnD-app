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
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useCampaign } from "../context/CampaignContext"; // 📌 Kampány kontextus importálása

const NavigationBar: React.FC<{ user: any }> = ({ user }) => {
  const { campaign, setCampaign } = useCampaign(); // 📌 Kontextusból töltjük be az adatokat
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 📌 Kampányváltáskor frissítjük a globális állapotot
  const handleMenuClose = (selectedCampaign: "icepeak" | "witchlight") => {
    setCampaign(selectedCampaign === "icepeak"
      ? {
          name: "Dragon of Icespire Peak",
          image: "/icespire.webp",
          colors: ["#002b4e", "#005a8d"],
        }
      : {
          name: "The Wild Beyond the Witchlight",
          image: "/wild.jpg",
          colors: ["#4a125a", "#8d44ad"],
        }
    );
    setAnchorEl(null);
  };

  const navItems = [
    { label: "Home", path: "/profile" },
    { label: "Karakterlap", path: "/character-sheet" },
    { label: "Harc", path: "/combat" },
    { label: "Csapattagok", path: "/team" },
    { label: "Térkép", path: "/map" },
    { label: "Chat", path: "/chat" },
  ];

  return (
    <>
      {user && (
        <AppBar
          position="sticky"
          sx={{
            background: `linear-gradient(90deg, ${campaign.colors[0]}, ${campaign.colors[1]})`,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
            zIndex: 1100,
            paddingY: "10px",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
            
            {/* 🔹 Kampány választó gomb */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "absolute",
                left: 0,
                top: 0,
                width: "270px",
                height: "80px",
                backgroundImage: `url(${campaign.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "0px 15px 15px 0px",
                overflow: "hidden",
                textAlign: "left",
                boxShadow: "3px 0px 10px rgba(0, 0, 0, 0.6)",
                cursor: "pointer",
              }}
              onClick={handleMenuOpen}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(to right, rgba(0, 0, 0, 0.67), transparent)",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Cinzel Decorative', serif",
                  color: "#E0F7FA",
                  fontWeight: "bold",
                  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.8)",
                  position: "absolute",
                  bottom: "10px",
                  left: "15px",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {campaign.name}
                <ArrowDropDownIcon sx={{ marginLeft: "5px" }} />
              </Typography>
            </Box>

            {/* 🔹 Kampányváltó menü */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={() => handleMenuClose("icepeak")}>
                Dragon of Icespire Peak
              </MenuItem>
              <MenuItem onClick={() => handleMenuClose("witchlight")}>
                The Wild Beyond the Witchlight
              </MenuItem>
            </Menu>

            {/* 🔹 Mobilnézet hamburger menü (HAMBURGER ICON) */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: "flex", md: "none" }, marginLeft: "auto" }} 
            >
              <MenuIcon />
            </IconButton>

            {/* Navigációs gombok (PC-n) */}
            <Box sx={{ display: { xs: "none", md: "flex" }, marginLeft: "auto" }}>
              {navItems.map((item) => (
                <Button key={item.path} onClick={() => navigate(item.path)} sx={{ color: "#E0F7FA" }}>
                  {item.label}
                </Button>
              ))}
              <IconButton onClick={handleLogout} sx={{ color: "#fff", marginLeft: "15px" }}>
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* 🔹 Mobil menü drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <List>
          {navItems.map((item) => (
            <ListItem button key={item.path} onClick={() => { navigate(item.path); handleDrawerToggle(); }}>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
          {/* 🔹 Kijelentkezés opció a mobil menüben */}
          <ListItem button onClick={handleLogout}>
            <LogoutIcon sx={{ marginRight: "10px" }} />
            <ListItemText primary="Kijelentkezés" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default NavigationBar;
