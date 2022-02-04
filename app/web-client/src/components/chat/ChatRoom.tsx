import SendIcon from "@mui/icons-material/Send";
import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getRoomMessages } from "../../api";
import { IMessage } from "../../api/api.interfaces";
import { ChatRoomsWSEvents } from "../../enums/chat-rooms-ws-events.enum";
import ChatMessages from "./ChatMessages";

export interface Props {
  roomSelected: string;
  socket: Socket;
}

const ChatRoom: React.FC<Props> = ({ roomSelected, socket }) => {
  const [message, setMessage] = useState("");
  const [serverMessages, setServerMessages] = useState<IMessage[]>([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const getServerMessagesEffect = useCallback(async () => {
    const roomMessages = await getRoomMessages(roomSelected);
    setServerMessages(roomMessages.data);
  }, [roomSelected]);

  // clear messages on room selection, and fetch messages on mount
  useEffect(() => {
    setServerMessages([]);
    getServerMessagesEffect();
  }, [roomSelected, getServerMessagesEffect]);

  // Websocket connections
  useEffect(() => {
    if (socket) {
      // Join Room
      socket.emit(ChatRoomsWSEvents.JOIN_ROOM, roomSelected);
      // Subscribe to messages WS and fetch new messages on event.
      socket.on(ChatRoomsWSEvents.CHAT_TO_CLIENT, (data: any) => {
        getServerMessagesEffect();
      });
    }
  }, [socket, roomSelected, getServerMessagesEffect]);

  // Persist user, lightweight persistance for testing purposes
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUsername(savedUser);
    if (username) localStorage.setItem("user", username);
  }, [username]);

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    const payload: { sender: string; room: string; message: string } = {
      sender: username,
      room: roomSelected,
      message,
    };
    socket.emit(ChatRoomsWSEvents.CHAT_TO_SERVER, payload);
    setMessage("");
  };
  const handleUsername = (e: any) => {
    e.preventDefault();
    if (name) setUsername(name);
  };

  return (
    <Grid>
      {!username ? (
        <Grid container>
          <Grid item xs={6}>
            <TextField
              id="username-input"
              variant="standard"
              onChange={(e) => setName(e.target.value)}
              value={name}
              label="Enter your username"
            />
          </Grid>
          <Grid item xs={6} container justifyContent="flex-end">
            <form onSubmit={handleUsername}>
              <Button
                id="username-submit-btn"
                sx={{ width: "100px" }}
                variant="outlined"
                onClick={handleUsername}
              >
                OK
              </Button>
            </form>
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid container id="chatroom-title">
            <Grid item xs={6}>
              <Typography>{roomSelected.replace("_", " ")}</Typography>
            </Grid>
            <Grid item xs={6} container justifyContent="flex-end">
              <Typography>Welcome {username}</Typography>
            </Grid>
          </Grid>
          <ChatMessages
            messages={serverMessages}
            username={username}
            socket={socket}
            roomSelected={roomSelected}
          />
          <form onSubmit={handleSendMessage} style={{ height: "100%" }}>
            <Grid container>
              <Grid item xs={8}>
                <TextField
                  id="message-input"
                  variant="standard"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  label="message"
                  fullWidth
                />
              </Grid>
              <Grid
                item
                container
                xs={4}
                justifyContent="flex-start"
                alignContent="flex-end"
                alignItems="flex-end"
              >
                <IconButton onClick={handleSendMessage}>
                  <SendIcon />
                </IconButton>
              </Grid>
            </Grid>
          </form>
        </>
      )}
    </Grid>
  );
};
export default ChatRoom;
