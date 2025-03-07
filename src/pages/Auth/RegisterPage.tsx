import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../shared/utils/authHelpers';
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FallingLeaves from '../../shared/styles/FallingLeaves';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Görgetés tiltása
        return () => {
            document.body.style.overflow = 'auto'; // Visszaállítás, ha elnavigál
        };
    }, []);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError('A jelszavak nem egyeznek.');
            return;
        }
        const success = await registerUser(username, email, password);
        if (success) {
            navigate('/login');
        } else {
            setError('Hiba történt a regisztráció során.');
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
                            ⚠️ Az oldal jelenleg fejlesztés alatt áll, a felhasználók nem regisztrálhatnak be ideiglenesen! ⚠️
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
                    Regisztráció
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
                        label="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={inputStyle}
                    />
                    <TextField
                        fullWidth
                        label="Jelszó újra"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={inputStyle}
                    />

                    <Button
                        onClick={handleRegister}
                        fullWidth
                        sx={buttonStyle}
                    >
                        Regisztráció
                    </Button>
                </Box>

                <Typography
                    variant="body2"
                    sx={{ color: '#ffffff', marginTop: 3, cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => navigate('/login')}
                >
                    Van már fiókod? Bejelentkezés!
                </Typography>
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

export default RegisterPage;
