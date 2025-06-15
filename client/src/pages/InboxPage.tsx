import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card, Input, ScrollArea, Separator } from '../components';
import { Search, Send } from 'lucide-react';
import {
  getConversationMessages,
  getConversationsByUserId,
  markMessagesAsRead,
  MEDIA_BASE_URL,
  sendMessage,
} from '../api';
import { useChatSocket } from '../hooks/useChatSocket';
import { Conversation, Message } from '../interfaces';
import { useSearchParams } from 'react-router-dom';

const InboxPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [searchParams] = useSearchParams();
  const urlConversationId = searchParams.get('conversationId');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const bottomOfMessagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversation]);

  const handleSelectConversation = useCallback(
    async (convo: Conversation) => {
      setActiveConversation(convo);
      const msgs = await getConversationMessages(convo.id);
      setMessages(msgs);

      await markMessagesAsRead(convo.id, user.id);

      setConversations((prev) =>
        prev.map((c) => (c.id === convo.id ? { ...c, unreadCount: 0 } : c))
      );
    },
    [user.id]
  );

  useEffect(() => {
    if (!urlConversationId || conversations.length === 0) return;

    const found = conversations.find((c) => c.id === urlConversationId);
    if (found) {
      handleSelectConversation(found);
    }
  }, [urlConversationId, conversations, handleSelectConversation]);

  useChatSocket(activeConversation?.id || null, (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  });

  useEffect(() => {
    const load = async () => {
      const conversations = await getConversationsByUserId(user.id);
      setConversations(conversations);
    };
    load();
  }, [user.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    await sendMessage(activeConversation.id, user.id, newMessage.trim());
    setNewMessage('');
  };

  const formatConversationTime = (time: string) => {
    const date = new Date(time);
    console.log('Formatting time:', date);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} minutes ago`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conversations List */}
        <Card className="md:col-span-1 p-3">
          <div className="flex items-center mb-4 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[calc(80vh-120px)]">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div key={conversation.id}>
                  <div
                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors rounded-md ${
                      activeConversation?.id === conversation.id
                        ? 'bg-purple-100'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={`${MEDIA_BASE_URL}${conversation.otherParticipant?.profilePictureUrl}`}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">
                          {conversation.otherParticipant.firstName}{' '}
                          {conversation.otherParticipant.lastName}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[150px]">
                          {conversation.lastMessage}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {formatConversationTime(conversation.lastMessageTime)}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mt-1">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No conversations found</div>
            )}
          </ScrollArea>
        </Card>

        {/* Messages Area */}
        <Card className="md:col-span-2 flex flex-col h-[80vh]">
          {activeConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-3 border-b flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={`${MEDIA_BASE_URL}${activeConversation.otherParticipant?.profilePictureUrl}`}
                    alt="Participant Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{activeConversation.otherParticipant.firstName}</div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isCurrentUser = message.senderId === user.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            isCurrentUser
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                              : 'bg-gray-100'
                          }`}
                        >
                          <div>{message.content}</div>
                          <div
                            className={`text-xs mt-1 ${
                              isCurrentUser ? 'text-purple-100' : 'text-gray-500'
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomOfMessagesRef}></div>
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-3 border-t">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-grow"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-5xl mb-2">💬</div>
                <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
                <p className="max-w-sm">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InboxPage;
