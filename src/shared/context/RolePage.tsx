import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RolePage: React.FC = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole') || 'unknown';

    useEffect(() => {
        if (role === 'admin') {
            navigate('/admin-dashboard');
        } else {
            navigate('/campaign-selector');
        }
    }, [role, navigate]);

    return null;
};

export default RolePage;
