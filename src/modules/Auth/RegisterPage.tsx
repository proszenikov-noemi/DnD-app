import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import FallingLeaves from "../../components/FallingLeaves"; // 🍃 Falevelek effekt importálása

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Felhasználó Firestore-ban mentése
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: user.email,
      });

      // 🔹 Automatikusan generál egy karaktert a felhasználónak
      const characterRef = doc(db, "characters", user.uid);
      await setDoc(characterRef, {
        name: "Új Kalandor",
        race: "Ismeretlen",
        class: "N/A",
        walkSpeed: 30,
        initiative: 0,
        armorClass: 10,
        profilePicture: "",
        abilities: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
      });

      navigate("/profile"); // 🔹 Sikeres regisztráció után átirányít a profil oldalra
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
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        overflow: "hidden",
      }}
    >
      <FallingLeaves /> {/* 🍃 Falevelek háttérben */}

      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "15px",
          padding: "30px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.8)",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
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
        <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Felhasználónév" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Jelszó" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" fullWidth>
            Regisztráció
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ marginTop: 3, color: "#ffffff" }}>
          Már van fiókod? <Link to="/login">Lépj be itt!</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;
