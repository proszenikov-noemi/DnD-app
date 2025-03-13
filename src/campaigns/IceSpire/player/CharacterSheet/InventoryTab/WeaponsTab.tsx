import React, { useState } from 'react';
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const WeaponsTab: React.FC<{ character: any; onUpdate: (newData: any) => void }> = ({ character, onUpdate }) => {
    const [weapons, setWeapons] = useState(character.weapons || []);
    const [newWeapon, setNewWeapon] = useState({ name: '', damage: '', type: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingWeapon, setEditingWeapon] = useState({ name: '', damage: '', type: '' });

    // 🔥 Új fegyver hozzáadása
    const addWeapon = () => {
        if (newWeapon.name.trim() === '') return;
        const updatedWeapons = [...weapons, newWeapon];
        setWeapons(updatedWeapons);
        onUpdate({ ...character, weapons: updatedWeapons });
        setNewWeapon({ name: '', damage: '', type: '' });
        setIsAdding(false);
    };

    // 🔥 Fegyver törlése
    const deleteWeapon = (index: number) => {
        const updatedWeapons = weapons.filter((_, i) => i !== index);
        setWeapons(updatedWeapons);
        onUpdate({ ...character, weapons: updatedWeapons });
    };

    // 🔥 Szerkesztés megkezdése
    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditingWeapon(weapons[index]);
    };

    // 🔥 Szerkesztés mentése
    const saveEditing = () => {
        if (editingIndex === null) return;
        const updatedWeapons = [...weapons];
        updatedWeapons[editingIndex] = editingWeapon;
        setWeapons(updatedWeapons);
        onUpdate({ ...character, weapons: updatedWeapons });
        setEditingIndex(null);
    };

    return (
        <Box>
            {/* 🔥 Fegyver lista */}
            <List>
                {weapons.map((weapon, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={`${weapon.name} - ${weapon.damage} (${weapon.type})`} />
                        <IconButton onClick={() => startEditing(index)}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => deleteWeapon(index)}>
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
                    Új fegyver hozzáadása
                </Button>
            )}

            {/* 🔥 Hozzáadás mezők (csak ha "Hozzáadás" gombra kattintunk) */}
            {isAdding && (
                <Box mt={2}>
                    <TextField
                        label="Fegyver neve"
                        value={newWeapon.name}
                        onChange={(e) => setNewWeapon({ ...newWeapon, name: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Sebzés"
                        value={newWeapon.damage}
                        onChange={(e) => setNewWeapon({ ...newWeapon, damage: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Típus"
                        value={newWeapon.type}
                        onChange={(e) => setNewWeapon({ ...newWeapon, type: e.target.value })}
                        fullWidth
                    />

                    <Button variant="contained" color="success" onClick={addWeapon} sx={{ mt: 1 }}>
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
                    <DialogTitle>Fegyver szerkesztése</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Fegyver neve"
                            value={editingWeapon.name}
                            onChange={(e) => setEditingWeapon({ ...editingWeapon, name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Sebzés"
                            value={editingWeapon.damage}
                            onChange={(e) => setEditingWeapon({ ...editingWeapon, damage: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Típus"
                            value={editingWeapon.type}
                            onChange={(e) => setEditingWeapon({ ...editingWeapon, type: e.target.value })}
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

export default WeaponsTab;
