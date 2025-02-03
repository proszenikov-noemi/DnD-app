import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBoxVisible, setIsBoxVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAnimating) {
      document.body.style.overflow = "hidden"; // 🔹 Görgetősáv elrejtése
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAnimating]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: user.email,
        character: null,
      });

      // 🔹 Animáció elindítása
      setIsBoxVisible(false);
      setTimeout(() => {
        setIsAnimating(true);
      }, 50);

      // 🔹 Átirányítás 1.5 másodperc után a bejelentkezési oldalra
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError("Hiba történt a regisztráció során!");
    }
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
        transform: isAnimating ? "scale(5) translateY(20%)" : "scale(1)",
        transition: isAnimating
          ? "transform 1.2s ease-in-out, opacity 0.8s ease-in-out"
          : "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: isAnimating ? 0 : 1,
      }}
    >
      {/* 🔹 Szövegdoboz azonnali eltüntetése */}
      {isBoxVisible && (
        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "15px",
            padding: "30px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.8)",
            textAlign: "center",
            transition: "opacity 0.5s ease-in-out",
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
            Regisztráció
          </Typography>
          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Felhasználónév"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "#333",
                  color: "#fff",
                  borderRadius: "5px",
                },
                "& .MuiInputLabel-root": {
                  color: "#aaa",
                },
              }}
            />
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "#333",
                  color: "#fff",
                  borderRadius: "5px",
                },
                "& .MuiInputLabel-root": {
                  color: "#aaa",
                },
              }}
            />
            <TextField
              label="Jelszó"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "#333",
                  color: "#fff",
                  borderRadius: "5px",
                },
                "& .MuiInputLabel-root": {
                  color: "#aaa",
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
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
              Regisztráció
            </Button>
          </Box>
          <Typography
            variant="body2"
            align="center"
            sx={{
              marginTop: 3,
              color: "#ffffff",
              fontFamily: "'MedievalSharp', serif",
            }}
          >
            Már van fiókod?{" "}
            <Link
              to="/login"
              style={{
                color: "#f4a261",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Lépj be itt!
            </Link>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RegisterPage;
