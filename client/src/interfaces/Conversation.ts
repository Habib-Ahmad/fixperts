import { User } from './User';

export interface Conversation {
  id: string;
  otherParticipant: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
