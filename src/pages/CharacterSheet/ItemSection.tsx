import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { db, auth } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const ItemSection: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchItems = async () => {
      if (!userId) return;

      const charDoc = doc(db, "characters", userId);
      const charSnap = await getDoc(charDoc);

      if (charSnap.exists()) {
        const data = charSnap.data();
        setItems(data.inventory?.items || []);
      }
    };

    fetchItems();
  }, [userId]);

  const saveItems = async (updatedItems: string[]) => {
    if (!userId) return;

    const charDoc = doc(db, "characters", userId);
    await updateDoc(charDoc, {
      "inventory.items": updatedItems,
    });
    setItems(updatedItems);
  };

  const addItem = () => {
    const updatedItems = [...items, newItem.trim()];
    saveItems(updatedItems);
    setNewItem("");
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    saveItems(updatedItems);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#2a2a40",
        padding: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" color="#f4a261" sx={{ marginBottom: 2 }}>
        Items
      </Typography>
      <Box display="flex" gap={2} sx={{ marginBottom: 2 }}>
        <TextField
          label="Add Item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          fullWidth
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: "#333",
              color: "#fff",
            },
            "& .MuiInputLabel-root": { color: "#aaa" },
          }}
        />
        <Button variant="contained" color="primary" onClick={addItem}>
          Add
        </Button>
      </Box>
      {items.map((item, index) => (
        <Box
          key={index}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            backgroundColor: "#333",
            padding: 2,
            borderRadius: 2,
            marginBottom: 2,
            border: "1px solid #f4a261",
          }}
        >
          <Typography color="#fff">{item}</Typography>
          <Button variant="contained" color="error" onClick={() => removeItem(index)}>
            Remove
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default ItemSection;
