import WebSocket from "ws";
export const webSocketSubscribers = new Map<string, WebSocket[]>();