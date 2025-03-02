import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (email === 'admin@email.com' && password === 'Admin1234') {
            sessionStorage.setItem('isAdmin', 'true');
            navigate('/admin-dashboard');
        } else {
            alert('Hibás belépési adatok!');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-card">
                <h2>Admin Bejelentkezés</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="admin-input"
                />
                <input
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-input"
                />
                <button onClick={handleLogin} className="admin-button">Belépés</button>
            </div>
        </div>
    );
};

export default AdminLogin;
