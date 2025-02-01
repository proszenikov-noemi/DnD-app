import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

interface TeamMember {
  id: string;
  name: string;
  race: string;
  class: string;
  hp: number;
}

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [open, setOpen] = useState(false);
  const [newMember, setNewMember] = useState<TeamMember>({
    id: '',
    name: '',
    race: '',
    class: '',
    hp: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      const teamRef = collection(db, 'team');
      const snapshot = await getDocs(teamRef);
      const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
      setTeamMembers(members);
    };
    fetchTeam();
  }, []);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.race || !newMember.class || newMember.hp <= 0) return;

    const teamRef = collection(db, 'team');
    const docRef = await addDoc(teamRef, newMember);
    setTeamMembers([...teamMembers, { ...newMember, id: docRef.id }]);
    setNewMember({ id: '', name: '', race: '', class: '', hp: 0 });
    handleCloseDialog();
  };

  return (
    <Container maxWidth="md">
      {/* Vissza a profilra gomb a bal felső sarokban */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate('/profile')}
        sx={{ position: 'absolute', top: 10, left: 10 }}
      >
        Vissza a Profilra
      </Button>

      <Typography variant="h3" gutterBottom textAlign="center">
        Csapattagok
      </Typography>
      
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        {teamMembers.map(member => (
          <Paper key={member.id} elevation={4} sx={{ padding: 2, width: '100%', textAlign: 'center' }}>
            <Typography variant="h5">{member.name}</Typography>
            <Typography variant="body1">Faj: {member.race}</Typography>
            <Typography variant="body1">Kaszt: {member.class}</Typography>
            <Typography variant="body1">HP: {member.hp}</Typography>
          </Paper>
        ))}
      </Box>
      
      {/* Csak a bejelentkezett felhasználó láthatja */}
      {auth.currentUser && (
        <Box sx={{ marginTop: 4 }}>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Új csapattag hozzáadása
          </Button>
        </Box>
      )}

      {/* Új csapattag hozzáadása dialógus */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Új csapattag hozzáadása</DialogTitle>
        <DialogContent>
          <TextField label="Név" name="name" fullWidth margin="dense" value={newMember.name} onChange={handleInputChange} />
          <TextField label="Faj" name="race" fullWidth margin="dense" value={newMember.race} onChange={handleInputChange} />
          <TextField label="Kaszt" name="class" fullWidth margin="dense" value={newMember.class} onChange={handleInputChange} />
          <TextField label="HP" name="hp" type="number" fullWidth margin="dense" value={newMember.hp} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Mégse
          </Button>
          <Button onClick={handleAddMember} color="primary">
            Hozzáadás
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeamPage;