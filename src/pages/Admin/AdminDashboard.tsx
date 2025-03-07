import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../shared/utils/firebase';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h1>Admin Dashboard - Kampányok kezelése</h1>
            <button onClick={handleLogout}>Kijelentkezés</button>
            {campaigns.map(campaign => (
                <div key={campaign.id} style={{ marginBottom: '30px' }}>
                    <h2 style={{ textDecoration: 'underline' }}>{campaign.name} Kampány</h2>
                    <table border={1} cellPadding={5}>
                        <thead>
                            <tr>
                                <th>Felhasználónév</th>
                                <th>Szerepkör</th>
                                <th>Művelet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaign.players.map(player => (
                                <tr key={player.uid}>
                                    <td>{player.username}</td>
                                    <td>{player.role}</td>
                                    <td>
                                        <select
                                            value={player.role}
                                            onChange={(e) => handleRoleChange(campaign.id, player.uid, e.target.value)}
                                        >
                                            <option value="user">Játékos</option>
                                            <option value="dm">Dungeon Master</option>
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
