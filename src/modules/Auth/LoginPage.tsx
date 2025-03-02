import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Checkbox, FormControlLabel } from "@mui/material";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import FallingLeaves from "../../components/FallingLeaves";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [resetEmail, setResetEmail] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);
    const [openResetDialog, setOpenResetDialog] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem("rememberedUser");
        if (savedUser) {
            const { username, password } = JSON.parse(savedUser);
            setUsername(username);
            setPassword(password);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const usersRef = doc(db, "usernames", username);
            const userSnap = await getDoc(usersRef);

            if (!userSnap.exists()) {
                setError("Nincs ilyen felhasználónév!");
                return;
            }

            const email = userSnap.data().email;

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (username.toLowerCase() === "admin") {
                sessionStorage.setItem("isAdmin", "true");
                navigate("/admin-dashboard");
            } else {
                sessionStorage.removeItem("isAdmin");

                if (rememberMe) {
                    localStorage.setItem("rememberedUser", JSON.stringify({ username, password }));
                } else {
                    localStorage.removeItem("rememberedUser");
                }

                navigate("/profile");
            }
        } catch (err) {
            setError("Hibás felhasználónév vagy jelszó!");
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
                backgroundImage: `url('/HomePageBackground.webp')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                position: "relative",
            }}
        >
            <FallingLeaves />

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
                        label="Felhasználónév"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{
                            "& .MuiInputBase-root": { backgroundColor: "#333", color: "#fff", borderRadius: "5px" },
                            "& .MuiInputLabel-root": { color: "#aaa" },
                        }}
                    />
                    <TextField
                        label="Jelszó"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiInputBase-root": { backgroundColor: "#333", color: "#fff", borderRadius: "5px" },
                            "& .MuiInputLabel-root": { color: "#aaa" },
                        }}
                    />

                    <FormControlLabel
                        control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                        label="Emlékezz rám"
                        sx={{ color: "#fff" }}
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

            <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)} maxWidth="sm" fullWidth>
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
                            "& .MuiInputBase-root": { backgroundColor: "#f7f7f7", borderRadius: "8px" },
                        }}
                    />
                    {resetSuccess && <Typography color="success">Jelszó-visszaállítási email elküldve!</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenResetDialog(false)}>Mégse</Button>
                    <Button onClick={handlePasswordReset} variant="contained">Küldés</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LoginPage;
