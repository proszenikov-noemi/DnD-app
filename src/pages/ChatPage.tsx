import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // 🗑️ Törlés ikon
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

interface Message {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Timestamp;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Névtelen Kalandor"); // 🔹 Alapértelmezett név
  const user = auth.currentUser;

  // 🔹 Felhasználónév lekérése a Firestore "users" kollekciójából
  useEffect(() => {
    const fetchUsername = async () => {
      if (!user?.uid) return;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUsername(userDocSnap.data().username || "Névtelen Kalandor");
      }
    };

    fetchUsername();
  }, [user]);

  // 🔹 Üzenetek figyelése Firestore-ban
  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Üzenet küldése Firestore-ba
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!user?.uid) return;

    const messagesRef = collection(db, "messages");
    await addDoc(messagesRef, {
      userId: user.uid,
      username: username, // 🔹 A lekért név kerül ide!
      message: newMessage.trim(),
      timestamp: Timestamp.now(),
    });

    setNewMessage("");
  };

  // 🔹 Üzenet törlése Firestore-ból
  const deleteMessage = async (messageId: string, messageUserId: string) => {
    if (user?.uid !== messageUserId) {
      alert("Nem törölheted mások üzeneteit!");
      return;
    }

    await deleteDoc(doc(db, "messages", messageId));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1e1e2e",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      {/* Fejléc */}
      <Typography
        variant="h4"
        sx={{
          color: "#FFD700",
          fontFamily: "'MedievalSharp', serif",
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
          marginBottom: 2,
        }}
      >
        Közös Chatszoba
      </Typography>

      {/* Üzenetek lista */}
      <Paper
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: "800px",
          overflowY: "auto",
          backgroundColor: "#2a2a40",
          padding: 2,
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
        }}
      >
        <List>
          {messages.map((msg) => (
            <ListItem
              key={msg.id}
              sx={{
                marginBottom: 1,
                borderBottom: "1px solid #3a3a4a",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#FFD700",
                      fontWeight: "bold",
                      fontFamily: "'MedievalSharp', serif",
                    }}
                  >
                    {msg.username}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body1"
                    sx={{ color: "#ffffff", fontSize: "16px" }}
                  >
                    {msg.message}
                  </Typography>
                }
              />

              {/* 🔹 Törlés gomb, csak saját üzeneteknél látható */}
              {user?.uid === msg.userId && (
                <IconButton onClick={() => deleteMessage(msg.id, msg.userId)} sx={{ color: "#ff6666" }}>
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Üzenet küldése */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          marginTop: 2,
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <TextField
          fullWidth
          label="Írj egy üzenetet..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: "#333",
              color: "#fff",
            },
            "& .MuiInputLabel-root": { color: "#aaa" },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          sx={{
            backgroundColor: "#f4a261",
            color: "#ffffff",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#e76f51" },
          }}
        >
          Küldés
        </Button>
      </Box>
    </Box>
  );
};

export default ChatPage;
