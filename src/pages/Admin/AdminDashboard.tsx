import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem('isAdmin') !== 'true') {
            navigate('/admin-login');
        }
    }, [navigate]);

    return (
        <div className="admin-dashboard-container">
            <h1>Admin Dashboard</h1>
            <p>Itt tudod menedzselni a kampányokat és a felhasználói jogosultságokat.</p>

            <div className="admin-section">
                <h2>Kampányok kezelése</h2>
                <button>Új kampány létrehozása</button>
            </div>

            <div className="admin-section">
                <h2>Felhasználói jogosultságok</h2>
                <button>Jogosultságok módosítása</button>
            </div>
        </div>
    );
};

export default AdminDashboard;
