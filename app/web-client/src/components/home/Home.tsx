import { Avatar, Button, Grid, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { getChatRooms } from "../../api/index";
import logo from "../../assets/logo.png";
import { useWSConnect } from "../../hooks/useWSconnect";
import ChatModal from "../chat/ChatModal";
import { mainStyles } from "./home.styles";
export interface Props {}

const Home: React.FC<Props> = () => {
  const socket = useWSConnect();
  const [chatRooms, setChatRooms] = useState<string[]>([]);
  const [roomSelected, setRoomSelected] = useState("");
  const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);

  const getChatRoomsEffect = useCallback(async () => {
    try {
      const res = await getChatRooms();
      setChatRooms(res.data);
    } catch (error) {}
  }, []);

  const handleRoomSelection = (roomOnClick: string) => {
    setRoomSelected(roomOnClick);
    const notSelectedRooms = chatRooms.filter(
      (room: string) => room !== roomOnClick
    );

    leaveOtherRooms(notSelectedRooms);
    setIsChatRoomOpen(true);
  };
  const leaveOtherRooms = (notSelectedRooms: string[]) => {
    if (socket)
      notSelectedRooms.map((room: string) => socket.emit("leaveRoom", room));
  };
  useEffect(() => {
    getChatRoomsEffect();
  }, [getChatRoomsEffect]);

  return (
    <Grid
      sx={mainStyles.main_container}
      justifyContent="center"
      alignItems="flex-start"
      alignContent="center"
      container
    >
      <Grid
        container
        justifyContent="center"
        alignItems="flex-end"
        id="logo-container"
      >
        <Avatar
          id="coinsmart-logo"
          variant="square"
          src={logo}
          sx={mainStyles.logo}
        />
      </Grid>
      <Grid
        justifyContent="center"
        alignItems="flex-end"
        container
        id="chat-rooms-title"
      >
        <Typography variant="h6">
          I guess you want to chat ? pick a room
        </Typography>
      </Grid>
      <Grid
        container
        justifyContent="center"
        alignItems="flex-end"
        id="chat-rooms-btns-container"
      >
        {chatRooms.map((room: string) => {
          return (
            <Grid item key={room}>
              <Button
                id={`${room.toLowerCase()}-room-btn`}
                onClick={() => handleRoomSelection(room)}
              >
                {room.replace("_", " ")}
              </Button>
            </Grid>
          );
        })}
      </Grid>
      {socket && (
        <ChatModal
          socket={socket}
          roomSelected={roomSelected}
          isOpen={isChatRoomOpen}
          setIsOpen={setIsChatRoomOpen}
        />
      )}
    </Grid>
  );
};
export default Home;
