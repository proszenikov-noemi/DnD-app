import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Link } from "react-router-dom";
import FallingLeaves from "../../components/FallingLeaves"; // 🌿 Animáció importálása

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (err) {
      setError("Hibás email vagy jelszó!");
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
    } catch (err) {
      setError("Nem sikerült elküldeni a jelszó-visszaállítási emailt.");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url('/HomePageBackground.webp')`, // 🌳 Új háttérkép
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        position: "relative",
      }}
    >
      <FallingLeaves /> {/* 🌿 Animáció a háttérben */}

      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.7)", // 🔹 Átlátszó sötét háttér
          borderRadius: "15px",
          padding: "30px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.8)",
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
          Bejelentkezés
        </Typography>

        {error && (
          <Typography color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              "& .MuiInputLabel-root": { color: "#aaa" },
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
              "& .MuiInputLabel-root": { color: "#aaa" },
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
            Bejelentkezés
          </Button>
        </Box>

        <Typography
          variant="body2"
          align="center"
          sx={{ marginTop: 3, color: "#ffffff", fontFamily: "'MedievalSharp', serif" }}
        >
          Még nincs fiókod?{" "}
          <Link to="/register" style={{ color: "#f4a261", fontWeight: "bold", textDecoration: "none" }}>
            Regisztrálj itt!
          </Link>
        </Typography>

        {/* Jelszó visszaállítás link */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            marginTop: 2,
            color: "#f4a261",
            fontFamily: "'MedievalSharp', serif",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => setOpenResetDialog(true)}
        >
          Elfelejtetted a jelszavad?
        </Typography>
      </Box>

      {/* Jelszó visszaállítási modal */}
      <Dialog 
  open={openResetDialog} 
  onClose={() => setOpenResetDialog(false)}
  maxWidth="sm" // 🖥️ Szélesebb ablak
  fullWidth // 🔹 Teljes szélesség kihasználása
>
  <DialogTitle sx={{ textAlign: "center" }}>Jelszó visszaállítása</DialogTitle>
  <DialogContent sx={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
    <Typography variant="body1" sx={{ marginBottom: 2 }}>
      Add meg az email-címed, és küldünk egy jelszó-visszaállítási linket!
    </Typography>
    <TextField
      autoFocus
      margin="dense"
      label="Email cím"
      fullWidth
      variant="outlined"
      value={resetEmail}
      onChange={(e) => setResetEmail(e.target.value)}
      sx={{
        "& .MuiInputBase-root": {
          backgroundColor: "#f7f7f7",
          borderRadius: "8px",
        },
      }}
    />
    {resetSuccess && (
      <Typography color="success" sx={{ marginTop: 1, textAlign: "center" }}>
        Jelszó-visszaállítási email elküldve!
      </Typography>
    )}
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center", paddingBottom: "15px" }}>
    <Button onClick={() => setOpenResetDialog(false)} color="secondary">
      Mégse
    </Button>
    <Button onClick={handlePasswordReset} color="primary" variant="contained">
      Küldés
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default LoginPage;
