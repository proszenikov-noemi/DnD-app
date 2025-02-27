import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useCampaign } from '../context/CampaignContext';
import './ProfilePage.css';  // FONTOS: ez az import kell

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<{ username?: string } | null>(null);
  const navigate = useNavigate();
  const { campaign } = useCampaign();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data() as { username?: string });
          } else {
            console.error("A felhasználói adatok nem találhatók az adatbázisban!");
          }
        } catch (error) {
          console.error("Hiba történt az adatok betöltésekor:", error);
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="profile-container">
      <video className="background-video" autoPlay loop muted>
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div
        className="background-overlay"
        style={{
          background: `linear-gradient(180deg, ${campaign.colors[0]}99, ${campaign.colors[1]}99)`,
        }}
      />

      {/* 🔹 Dinamikus stílusok átadása a profil-kártyának */}
      <div 
        className="profile-card"
        style={{
          ['--campaign-color1' as any]: campaign.colors[0],
          ['--campaign-color2' as any]: campaign.colors[1],
          ['--campaign-glow-color' as any]: campaign.colors[1]
        }}
      >
        <h2 className="profile-title">{userData?.username || 'Kalandor'}</h2>

        <div className="button-container">
          <Link to="/character-sheet" className="profile-button">Karakterlap</Link>
          <Link to="/combat" className="profile-button">Harc</Link>
          <Link to="/team" className="profile-button">Csapattagok</Link>
          <Link to="/map" className="profile-button">Térkép</Link>
          <Link to="/chat" className="profile-button">Chat</Link>
          <button className="logout-button" onClick={handleLogout}>Kijelentkezés</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
