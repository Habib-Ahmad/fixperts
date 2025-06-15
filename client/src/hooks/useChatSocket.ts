import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { Message } from '../interfaces';

export function useChatSocket(
  conversationId: string | null,
  onMessageReceived: (message: Message) => void
) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const client = new Client({
      brokerURL: 'ws://localhost:8081/ws-stomp',
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
    });

    client.onConnect = () => {
      console.log('[STOMP] Connected to WebSocket');

      client.subscribe(`/topic/conversations/${conversationId}`, (msg) => {
        const message: Message = JSON.parse(msg.body);
        console.log('[STOMP] Message received:', message);
        onMessageReceived(message);
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [conversationId, onMessageReceived]);

  return clientRef;
}
