import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as React from "react";
import { Socket } from "socket.io-client";
import ChatRoom from "./ChatRoom";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export interface Props {
  roomSelected: string;
  socket: Socket;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatModal: React.FC<Props> = ({
  roomSelected,
  socket,
  isOpen,
  setIsOpen,
}) => {
  return (
    <Grid>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-chat-room"
        aria-describedby="modal-chat-room"
      >
        <Box sx={style}>
          <ChatRoom roomSelected={roomSelected} socket={socket} />
        </Box>
      </Modal>
    </Grid>
  );
};
export default ChatModal;
