import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../shared/utils/firebase';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';  // CSS importálás

interface Player {
    uid: string;
    username: string;
    role: string;
}

interface Campaign {
    id: string;
    name: string;
    players: Player[];
}

const AdminDashboardPage: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCampaigns = async () => {
            const campaignsCollection = collection(db, 'campaigns');
            const snapshot = await getDocs(campaignsCollection);

            const campaignList: Campaign[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    players: data.players || []
                };
            });

            setCampaigns(campaignList);
        };

        fetchCampaigns();
    }, []);

    const handleRoleChange = async (campaignId: string, playerUid: string, newRole: string) => {
        const campaignDocRef = doc(db, 'campaigns', campaignId);

        const updatedCampaigns = campaigns.map(campaign => {
            if (campaign.id === campaignId) {
                const updatedPlayers = campaign.players.map(player =>
                    player.uid === playerUid ? { ...player, role: newRole } : player
                );
                return { ...campaign, players: updatedPlayers };
            }
            return campaign;
        });

        const updatedPlayers = updatedCampaigns.find(c => c.id === campaignId)?.players || [];

        await updateDoc(campaignDocRef, { players: updatedPlayers });

        setCampaigns(updatedCampaigns);
    };

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/');
    };

    return (
        <div className="admin-dashboard-container">
            <h1 className="admin-dashboard-title">Admin Dashboard - Kampányok kezelése</h1>
            <button className="admin-logout-button" onClick={handleLogout}>Kijelentkezés</button>
            {campaigns.map(campaign => (
                <div key={campaign.id} className="campaign-section">
                    <h2 className="campaign-title">{campaign.name} Kampány</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Felhasználónév</th>
                                <th>Szerepkör</th>
                                <th>Művelet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaign.players.map(player => (
                                <tr key={player.uid} className={player.role === 'dm' ? 'dm-role' : ''}>
                                    <td>{player.username}</td>
                                    <td className={player.role === 'dm' ? 'dm-text' : ''}>{player.role}</td>
                                    <td>
                                        <select
                                            value={player.role}
                                            onChange={(e) => handleRoleChange(campaign.id, player.uid, e.target.value)}
                                        >
                                            <option value="user">Játékos</option>
                                            <option value="dm" className="dm-option">Dungeon Master</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default AdminDashboardPage;
