import { API_BASE_URL } from "./apiConfig";

export type SubmissionSocketMessage =
  | { type: "connected"; message?: string }
  | { type: "subscribed"; submissionId: string; message?: string }
  | { type: "progress"; submissionId: string; progress: number; status?: string }
  | { type: "completed" | "already_completed"; submissionId: string; detectedComplexity?: string | null; confidence?: number | null }
  | { type: "failed"; submissionId: string; error?: string };

const socketUrl = () => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
  const url = new URL(API_BASE_URL);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/ws";
  url.search = "";
  return url.toString();
};

class WebSocketService {
  private socket: WebSocket | null = null;
  private onFrame: ((message: SubmissionSocketMessage) => void) | null = null;
  private onStatus: ((connected: boolean) => void) | null = null;
  private queue = new Set<string>();

  connect() {
    const currentSocket = this.socket;
    if (currentSocket && (currentSocket.readyState === WebSocket.OPEN || currentSocket.readyState === WebSocket.CONNECTING)) return;
    this.socket = new WebSocket(socketUrl());
    this.socket.onopen = () => { this.onStatus?.(true); for (const item of this.queue) this.socket?.send(item); this.queue.clear(); };
    this.socket.onmessage = (event) => { try { this.onFrame?.(JSON.parse(event.data) as SubmissionSocketMessage); } catch { /* ignore invalid frames */ } };
    this.socket.onclose = () => this.onStatus?.(false);
    this.socket.onerror = () => this.onStatus?.(false);
  }

  onMessage(callback: (message: SubmissionSocketMessage) => void) { this.onFrame = callback; }
  onConnectionChange(callback: (connected: boolean) => void) { this.onStatus = callback; }
  subscribe(submissionId: string) {
    const payload = JSON.stringify({ type: "subscribe", submissionId });
    if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(payload); else this.queue.add(payload);
  }
  disconnect() { this.socket?.close(); this.socket = null; this.onFrame = null; this.onStatus = null; this.queue.clear(); }
}

export default new WebSocketService();