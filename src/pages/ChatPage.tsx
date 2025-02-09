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
} from "@mui/material";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: Timestamp;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const user = auth.currentUser;

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

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagesRef = collection(db, "messages");
    await addDoc(messagesRef, {
      userId: user?.uid,
      username: user?.displayName || "Névtelen Kalandor",
      message: newMessage.trim(),
      timestamp: Timestamp.now(),
    });

    setNewMessage("");
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
