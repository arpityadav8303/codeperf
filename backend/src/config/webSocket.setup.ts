import { Server as HttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { subscribe, unsubscribe } from "../services/notification.service";

export function setupWebSocket(httpServer: HttpServer): WebSocketServer {
    const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

    wss.on("connection", (ws: WebSocket) => {
        ws.send(JSON.stringify({
            type: "connected",
            message: "Send type: subscribe, submissionId: uuid to start."
        }));
        ws.on("message", async (rawData) => {
            try {
                const parsed = JSON.parse(rawData.toString());

                if (parsed.type === "subscribe" && typeof parsed.submissionId === "string") {
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

        ws.on("close", () => unsubscribe(ws));

        ws.on("error", (err) => console.error("[WS Error]:", err.message));
    });

    return wss;
}