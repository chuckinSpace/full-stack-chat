import { IsDefined, IsNotEmpty } from 'class-validator';

export class UpdateMessageDTO {
  @IsDefined()
  @IsNotEmpty()
  userId: string;
  @IsDefined()
  @IsNotEmpty()
  messageId: string;
  @IsDefined()
  @IsNotEmpty()
  newMessage: string;
}
