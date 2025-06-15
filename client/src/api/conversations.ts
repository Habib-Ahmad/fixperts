import api from './api';
import { urls } from './urls';

export const getOrCreateConversation = async (userId1: string, userId2: string) => {
  const response = await api.post(urls.conversations.getOrCreate, {
    userId1,
    userId2,
  });
  return response.data;
};

export const getConversationsByUserId = async (userId: string) => {
  const response = await api.get(urls.conversations.getByUserId(userId));
  return response.data;
};

export const getConversationMessages = async (conversationId: string) => {
  const response = await api.get(urls.conversations.getMessages(conversationId));
  return response.data;
};

export const sendMessage = async (conversationId: string, senderId: string, content: string) => {
  const response = await api.post(urls.conversations.sendMessage, {
    conversationId,
    senderId,
    content,
  });
  return response.data;
};

export const markMessagesAsRead = async (conversationId: string, userId: string) => {
  const response = await api.post(urls.conversations.markAsRead(conversationId, userId));
  return response.data;
};
