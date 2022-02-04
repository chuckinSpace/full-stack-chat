export interface DeleteMessageInput {
  userId: string;
  messageId: string;
}

export interface UpdateMessageInput {
  userId: string;
  messageId: string;
  newMessage: string;
}
