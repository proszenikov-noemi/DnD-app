import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithUsername, getUserGlobalRole } from '../../shared/utils/authHelpers';
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FallingLeaves from '../../shared/styles/FallingLeaves';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../shared/utils/firebase';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [resetSuccessMessage, setResetSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleLogin = async () => {
        setError('');
        try {
            const uid = await signInWithUsername(username, password, rememberMe);
            if (!uid) {
                setError('Hibás felhasználónév vagy jelszó.');
                return;
            }

            const role = await getUserGlobalRole(uid);
            if (role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/role');
            }
        } catch (err) {
            setError('Bejelentkezési hiba: ' + (err as Error).message);
        }
    };

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetSuccessMessage('Jelszó visszaállító email elküldve!');
            setResetEmail('');
        } catch (err) {
            setResetSuccessMessage('Hiba történt az email küldése közben.');
        }
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundImage: `url('/HomePageBackground.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
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
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '15px',
                    padding: '30px',
                    maxWidth: '500px',
                    width: '90%',
                    textAlign: 'center',
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.8)',
                    zIndex: 2,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: '#ffffff',
                        fontFamily: "'MedievalSharp', serif",
                        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)',
                        marginBottom: 3,
                    }}
                >
                    Bejelentkezés
                </Typography>

                {error && (
                    <Typography color="error" sx={{ marginBottom: 2 }}>
                        {error}
                    </Typography>
                )}

                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        fullWidth
                        label="Felhasználónév"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={inputStyle}
                    />
                    <TextField
                        fullWidth
                        label="Jelszó"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: '#f4a261' }}  // 🔸 Jobban kiemelt szín
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={inputStyle}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                sx={{ color: '#f4a261' }}
                            />
                        }
                        label={<Typography sx={{ color: '#fff' }}>Emlékezz rám</Typography>}
                    />

                    <Button onClick={handleLogin} fullWidth sx={buttonStyle}>
                        Bejelentkezés
                    </Button>
                </Box>

                <Typography
                    variant="body2"
                    sx={{ color: '#ffffff', marginTop: 3, cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => navigate('/register')}
                >
                    Nincs még fiókod? Regisztrálj!
                </Typography>

                <Typography
                    variant="body2"
                    sx={{ color: '#f4a261', marginTop: 2, cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => setResetDialogOpen(true)}
                >
                    Elfelejtett jelszó
                </Typography>

                <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
                    <DialogTitle sx={dialogTitleStyle}>Jelszó visszaállítása</DialogTitle>
                    <DialogContent sx={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', color: '#fff' }}>  {/* 🔹 Sötét háttér */}
                        <Typography sx={{ marginBottom: 2 }}>
                            Add meg az e-mail címed, és küldünk egy visszaállító linket.
                        </Typography>
                        <TextField
                            fullWidth
                            label="E-mail"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            sx={inputStyle}
                        />
                        {resetSuccessMessage && (
                            <Typography sx={{ color: '#f4a261', marginTop: 2 }}>
                                {resetSuccessMessage}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
                        <Button onClick={() => setResetDialogOpen(false)} sx={buttonStyle}>Mégse</Button>
                        <Button onClick={handlePasswordReset} sx={buttonStyle}>Küldés</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

const inputStyle = {
    '& .MuiInputBase-root': { backgroundColor: '#333', color: '#fff', borderRadius: '5px' },
    '& .MuiInputLabel-root': { color: '#aaa' },
};

const buttonStyle = {
    backgroundColor: '#f4a261',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'none',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
    '&:hover': { backgroundColor: '#e76f51' },
};

const dialogTitleStyle = {
    fontFamily: "'MedievalSharp', serif",
    color: '#f4a261',
    backgroundColor: '#000',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
};

export default LoginPage;
