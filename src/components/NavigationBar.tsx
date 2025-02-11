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

// 🔹 Kampányok definiálása
const campaigns = {
  icepeak: {
    name: "Dragon of Icespire Peak",
    image: "/icespire.webp",
    colors: ["#002b4e", "#005a8d"], // Sötétkék téma
  },
  witchlight: {
    name: "The Wild Beyond the Witchlight",
    image: "/wild.jpg",
    colors: ["#4a125a", "#8d44ad"], // Lila téma
  },
};

const NavigationBar: React.FC<{ user: any }> = ({ user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [campaign, setCampaign] = useState(campaigns.icepeak); // 🔹 Alapértelmezett kampány
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

  const handleMenuClose = (selectedCampaign: string) => {
    setCampaign(campaigns[selectedCampaign]);
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
            background: `linear-gradient(90deg, ${campaign.colors[0]}, ${campaign.colors[1]})`, // 🔹 Dinamikus színváltás
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
            zIndex: 1100,
            paddingY: "10px",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
            
            {/* 🔹 Kampány választó gomb */}
            <Box
              sx={{
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
                display: "flex",
                alignItems: "center",
                textAlign: "left",
                boxShadow: "3px 0px 10px rgba(0, 0, 0, 0.6)",
                cursor: "pointer",
              }}
              onClick={handleMenuOpen} // 🔹 Kampányválasztó menü megnyitása
            >
              {/* 🔹 Sötétebb háttér az olvashatóságért */}
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
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => handleMenuClose("icepeak")}>
                Dragon of Icespire Peak
              </MenuItem>
              <MenuItem onClick={() => handleMenuClose("witchlight")}>
                The Wild Beyond the Witchlight
              </MenuItem>
            </Menu>

            {/* Navigációs gombok a jobb oldalon */}
            <Box sx={{ display: { xs: "none", md: "flex" }, marginLeft: "auto" }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: "#E0F7FA",
                    fontSize: "16px",
                    fontWeight: "bold",
                    textTransform: "none",
                    fontFamily: "'MedievalSharp', serif",
                    marginLeft: "15px",
                    borderRadius: "10px",
                    padding: "8px 15px",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transition: "0.3s ease-in-out",
                    "&:hover": { backgroundColor: "#81D4FA", color: "#000" },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* 🔹 Kijelentkezés gomb (csak ikon, jobb oldalon) */}
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: "#fff",
                  marginLeft: "15px",
                  borderRadius: "10px",
                  transition: "0.3s ease-in-out",
                  "&:hover": { color: "#ff6659" },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      )}

    </>
  );
};

export default NavigationBar;
