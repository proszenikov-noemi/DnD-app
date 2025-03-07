import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import FallingLeaves from "../shared/styles/FallingLeaves"; // 🔹 Levelek animáció importálása

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Görgetés tiltása oldal betöltéskor
  useEffect(() => {
    document.body.style.overflow = "hidden"; // 🔹 Scroll teljes tiltása

    return () => {
      document.body.style.overflow = "auto"; // 🔹 Takarítás, ha elnavigálnak
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "fixed", // 🔹 Fontos, hogy ne legyen görgetés
        top: 0,
        left: 0,
        overflow: "hidden", // 🔹 Plusz biztosítás, hogy semmi ne lógjon ki
        backgroundImage: `url('/HomePageBackground.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        margin: 0,
      }}
    >
      <FallingLeaves /> {/* 🔹 Levelek animáció hozzáadása */}

                  {/* 🔴 Fejlesztés alatti figyelmeztetés */}
                  <Box
                     sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      backgroundColor: "rgba(255, 0, 0, 0.8)",
                      color: "#fff",
                      textAlign: "center",
                      padding: "10px 0",
                      fontWeight: "bold",
                      fontSize: "16px",
                      zIndex: 5,
                      fontFamily: "'MedievalSharp', serif",
                     }}
                  >
                      ⚠️ Az oldal jelenleg fejlesztés alatt áll, a felhasználók nem léphetnek be ideiglenesen! ⚠️
                  </Box>   

      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "15px",
          padding: "30px",
          maxWidth: "500px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.8)",
          zIndex: 2, // 🔹 A levelek alatt jelenjen meg
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#ffffff",
            fontFamily: "'MedievalSharp', serif",
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
            marginBottom: 4,
          }}
        >
          Üdvözlünk, Kalandor!
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#e0e0e0",
            fontFamily: "'MedievalSharp', serif",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
            marginBottom: 4,
          }}
        >
          Lépj be a világunkba, és írd meg a saját történeted!
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              backgroundColor: "#f4a261",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
              "&:hover": { backgroundColor: "#e76f51" },
            }}
          >
            Belépés
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/register")}
            sx={{
              backgroundColor: "#2a9d8f",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
              "&:hover": { backgroundColor: "#21867a" },
            }}
          >
            Regisztráció
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
