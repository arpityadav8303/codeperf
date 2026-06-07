// backend/src/config/websocket.setup.ts
import { Server as HttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { subscribe, unsubscribe } from "../services/notification.service";

export function setupWebSocket(httpServer: HttpServer): WebSocketServer {
    // Create the WebSocket server attached to the same HTTP port on the /ws path
    const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

    wss.on("connection", (ws: WebSocket) => {
        // 1. Send immediate welcome confirmation message to the client
        ws.send(JSON.stringify({
            type: "connected",
            message: "Send type: subscribe, submissionId: uuid to start."
        }));

        // 2. Handle incoming real-time message routing
        ws.on("message", async (rawData) => {
            try {
                const parsed = JSON.parse(rawData.toString());

                if (parsed.type === "subscribe" && typeof parsed.submissionId === "string") {
                    // Register the socket to receive live background progress updates
                    subscribe(parsed.submissionId, ws);
                    ws.send(JSON.stringify({
                        type: "subscribed",
                        submissionId: parsed.submissionId,
                        message: "Subscribed. Live updates incoming."
                    }));
                }
            } catch (err) {
                ws.send(JSON.stringify({ type: "error", message: "Invalid JSON format" }));
            }
        });

        // 3. Clean up subscription maps on disconnect to prevent memory leaks
        ws.on("close", () => unsubscribe(ws));

        // 4. Handle unexpected connection errors to prevent server thread crashes
        ws.on("error", (err) => console.error("[WS Error]:", err.message));
    });

    return wss;
}