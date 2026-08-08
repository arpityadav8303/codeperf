import { useCallback, useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setLastMessage(parsed);
      } catch (err) {
        console.error("Failed to parse websocket payload", err);
        setError("Received an invalid websocket payload");
      }
    };

    socket.onerror = () => {
      setError("WebSocket connection error");
    };

    socket.onclose = () => {
      setIsConnected(false);
      socketRef.current = null;
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [url]);

  const sendMessage = useCallback((message: unknown) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    socket.send(JSON.stringify(message));
    return true;
  }, []);

  const subscribe = useCallback((submissionId: string) => {
    return sendMessage({ type: "subscribe", submissionId });
  }, [sendMessage]);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    subscribe,
  };
}
