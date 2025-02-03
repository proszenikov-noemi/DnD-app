import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const HomePage: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBoxVisible, setIsBoxVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAnimating) {
      document.body.style.overflow = "hidden"; // Csúszkák eltüntetése
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAnimating]);

  const handleEnter = () => {
    setIsBoxVisible(false); // 🔹 Azonnal eltünteti a szövegdobozt
    setTimeout(() => {
      setIsAnimating(true); // 🔹 Zoomolás és fade-out késleltetve indul
    }, 50);

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        backgroundImage: `url('/HomePageBackground.webp')`,
        backgroundSize: "cover",
        backgroundPosition: isAnimating ? "center 90%" : "center",
        transform: isAnimating ? "scale(5) translateY(20%)" : "scale(1)", // 🔹 Zoomolás
        transition: isAnimating
          ? "transform 1.2s ease-in-out, opacity 0.8s ease-in-out"
          : "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: isAnimating ? 0 : 1, // 🔹 Fade out
      }}
    >
      {/* 🔹 Szövegdoboz azonnali eltüntetés */}
      {isBoxVisible && (
        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "15px",
            padding: "30px",
            textAlign: "center",
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.8)",
            zIndex: 2,
            transition: "opacity 0.3s ease-in-out",
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
              color="primary"
              onClick={handleEnter}
              sx={{
                backgroundColor: "#a67c52",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                "&:hover": { backgroundColor: "#8a5a44" },
              }}
            >
              Belépés
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/register")}
              sx={{
                backgroundColor: "#2a9d8f",
                color: "#fff",
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
      )}
    </Box>
  );
};

export default HomePage;
