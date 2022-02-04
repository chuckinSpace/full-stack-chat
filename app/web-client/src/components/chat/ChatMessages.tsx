import { CancelOutlined } from "@mui/icons-material";
import { Grid, IconButton, Typography } from "@mui/material";
import { blueGrey, grey } from "@mui/material/colors";
import React from "react";
import { Socket } from "socket.io-client";
import { deleteChatMessage } from "../../api";
import { IMessage } from "../../api/api.interfaces";
import { ChatRoomsWSEvents } from "../../enums/chat-rooms-ws-events.enum";

export interface Props {
  messages: IMessage[];
  username: string;
  socket: Socket;
  roomSelected: string;
}

const ChatMessages: React.FC<Props> = ({
  messages,
  username,
  socket,
  roomSelected,
}) => {
  const styles = {
    current_user: {
      justifyContent: "right",
      margin: "auto",
      fontWeight: "bold",
      color: blueGrey[900],
    } as const,
    other_users: {
      textAlign: "left",
      color: grey[400],
    } as const,
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteChatMessage({ userId: username, messageId });

    // send message to update all clients after delete
    socket.emit(ChatRoomsWSEvents.REFRESH, roomSelected, (data: any) => {});
  };

  return (
    <Grid
      container
      alignContent="flex-start"
      sx={{ p: 2, height: "300px", overflow: "auto" }}
    >
      {messages.map((message: IMessage) => {
        return (
          <Grid key={message._id} container>
            {username === message.userId && (
              <Grid
                container
                spacing={1}
                alignContent="center"
                sx={{ height: "100%", pt: 1 }}
                item
                xs={6}
              >
                <Grid item>
                  <IconButton
                    onClick={() => handleDeleteMessage(message._id)}
                    sx={{ p: 0 }}
                  >
                    <CancelOutlined id="delete-icon" sx={{ height: "25px" }} />
                  </IconButton>
                </Grid>
              </Grid>
            )}

            <Grid
              item
              xs={6}
              container
              sx={
                username === message.userId
                  ? styles.current_user
                  : styles.other_users
              }
            >
              <Typography>{message.message}</Typography>
            </Grid>
            {username !== message.userId && (
              <Grid container justifyContent="flex-end" item xs={6}>
                <Typography sx={{ fontSize: "0.8rem", color: grey[300] }}>
                  {message.userId}
                </Typography>
              </Grid>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};
export default ChatMessages;
