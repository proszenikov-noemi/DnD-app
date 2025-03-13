import React, { useState } from 'react';
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const ItemsTab: React.FC<{ character: any; onUpdate: (newData: any) => void }> = ({ character, onUpdate }) => {
    const [items, setItems] = useState(character.items || []);
    const [newItem, setNewItem] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState('');

    // 🔥 Új tárgy hozzáadása
    const addItem = () => {
        if (newItem.trim() === '') return;
        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        onUpdate({ ...character, items: updatedItems });
        setNewItem('');
        setIsAdding(false);
    };

    // 🔥 Tárgy törlése
    const deleteItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        onUpdate({ ...character, items: updatedItems });
    };

    // 🔥 Szerkesztés megkezdése
    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditingValue(items[index]);
    };

    // 🔥 Szerkesztés mentése
    const saveEditing = () => {
        if (editingIndex === null) return;
        const updatedItems = [...items];
        updatedItems[editingIndex] = editingValue;
        setItems(updatedItems);
        onUpdate({ ...character, items: updatedItems });
        setEditingIndex(null);
    };

    return (
        <Box>
            {/* 🔥 Tárgyak listája */}
            <List>
                {items.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={item} />
                        <IconButton onClick={() => startEditing(index)}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => deleteItem(index)}>
                            <Delete />
                        </IconButton>
                    </ListItem>
                ))}
            </List>

            {/* 🔥 Hozzáadás gomb */}
            {!isAdding && (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setIsAdding(true)}
                >
                    Új tárgy hozzáadása
                </Button>
            )}

            {/* 🔥 Hozzáadás mező (csak ha a "Hozzáadás" gombra kattintunk) */}
            {isAdding && (
                <Box mt={2}>
                    <TextField
                        label="Tárgy neve"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" color="success" onClick={addItem} sx={{ mt: 1 }}>
                        Hozzáadás
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => setIsAdding(false)} sx={{ mt: 1, ml: 2 }}>
                        Mégse
                    </Button>
                </Box>
            )}

            {/* 🔥 Szerkesztés modal */}
            {editingIndex !== null && (
                <Dialog open={editingIndex !== null} onClose={() => setEditingIndex(null)}>
                    <DialogTitle>Tárgy szerkesztése</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Tárgy neve"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={saveEditing} color="primary" variant="contained">
                            Mentés
                        </Button>
                        <Button onClick={() => setEditingIndex(null)} color="secondary">
                            Mégse
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default ItemsTab;
