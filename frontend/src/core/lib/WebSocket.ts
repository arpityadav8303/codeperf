class WebSocketService {
  private socket: WebSocket | null = null;
  private messageCallback: ((message: any) => void) | null = null;
  private sendQueue: string[] = [];

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.socket = new WebSocket("ws://localhost:8000/ws");

    this.socket.onopen = () => {
  console.log("⚡ WebSocket Connected");
  
  while (this.sendQueue.length > 0) {
    const payload = this.sendQueue.shift();
    if (payload) {
      this.socket?.send(payload);
    }
  }
};

    this.socket.onmessage = (event) => {
      if (this.messageCallback) {
        try {
          const parsedData = JSON.parse(event.data);
          this.messageCallback(parsedData);
        } catch (err) {
          console.error("Failed parsing incoming WS frame:", err);
        }
      }
    };

    this.socket.onclose = () => {
      console.log("🔌 WebSocket Closed");
    };

    this.socket.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };
  }

  onMessage(callback: (message: any) => void) {
    this.messageCallback = callback;
  }

  subscribe(submissionId: string) {
    const payload = JSON.stringify({
      type: "subscribe",
      submissionId,
    });

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(payload);
    } else {
      console.log(`[WS] Connection buffering. Queuing subscription for: ${submissionId}`);
      this.sendQueue.push(payload);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.messageCallback = null;
    this.sendQueue = [];
  }
}

export default new WebSocketService();