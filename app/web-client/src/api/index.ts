import { AxiosResponse } from "axios";
import { api } from "./api.base";
import { DeleteMessageInput, UpdateMessageInput } from "./api.inputs";
import { IMessage } from "./api.interfaces";
import { ApiRoutes } from "./api.routes.enum";

export const getChatRooms = (): Promise<AxiosResponse<string[]>> =>
  api.get(ApiRoutes.GET_CHAT_ROOMS);

export const getRoomMessages = (
  room: string
): Promise<AxiosResponse<IMessage[]>> =>
  api.get(ApiRoutes.MESSAGES, { params: { room } });

export const deleteChatMessage = (
  params: DeleteMessageInput
): Promise<AxiosResponse<any>> =>
  api.delete(ApiRoutes.MESSAGES, {
    params: { userId: params.userId, messageId: params.messageId },
  });
export const updateChatMessage = (
  params: UpdateMessageInput
): Promise<AxiosResponse<any>> => api.patch(ApiRoutes.MESSAGES, params);
