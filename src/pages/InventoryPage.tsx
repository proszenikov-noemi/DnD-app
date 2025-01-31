import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hozzáadjuk a navigációt
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Container, TextField, Button, Typography, List, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { db, auth } from '../firebase';

const InventoryPage: React.FC = () => {
  const navigate = useNavigate(); // Navigáció hook
  const [items, setItems] = useState<{ id: string; name: string }[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      if (auth.currentUser) {
        const querySnapshot = await getDocs(collection(db, 'users', auth.currentUser.uid, 'inventory'));
        setItems(querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
      }
    };
    fetchItems();
  }, []);

  const addItem = async () => {
    if (auth.currentUser && newItem) {
      const docRef = await addDoc(collection(db, 'users', auth.currentUser.uid, 'inventory'), { name: newItem });
      setItems(prev => [...prev, { id: docRef.id, name: newItem }]);
      setNewItem('');
    }
  };

  const deleteItem = async (id: string) => {
    if (auth.currentUser) {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'inventory', id));
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>
      <Button variant="outlined" color="primary" onClick={() => navigate('/profile')} style={{ marginBottom: '20px' }}>
        Vissza a Profil oldalra
      </Button>
      <Paper style={{ padding: '16px', marginBottom: '20px' }}>
        <TextField
          label="Új tárgy"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          fullWidth
          style={{ marginBottom: '16px' }}
        />
        <Button variant="contained" color="primary" onClick={addItem}>
          Hozzáadás
        </Button>
      </Paper>
      <List>
        {items.map((item) => (
          <ListItem key={item.id} secondaryAction={
            <IconButton edge="end" onClick={() => deleteItem(item.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default InventoryPage;
