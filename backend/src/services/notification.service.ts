import WebSocket from "ws";

export type WSMessage =
    | { type: "subscribed"; submissionId: string; message: string }
    | { type: "progress"; submissionId: string; progress: number; status: string; message?: string }
    | { type: "completed"; submissionId: string; detectedComplexity: string; confidence: number; progress?: number; status?: string }
    | { type: "failed"; submissionId: string; error: string; status?: string }
    | { 
        type: "already_completed"; 
        submissionId: string; 
        status: string; 
        detectedComplexity: string | null; 
        confidence: number | null 
      };

const subscriptions = new Map<string, Set<WebSocket>>();


export function subscribe(submissionId: string, ws: WebSocket): void {
    if (!subscriptions.has(submissionId)) {
        subscriptions.set(submissionId, new Set<WebSocket>());
    }
    
    subscriptions.get(submissionId)!.add(ws);
    
    console.log(`[WS] Subscribed to: ${submissionId}. Total subscribers: ${subscriptions.get(submissionId)!.size}`);
}

export function unsubscribe(ws: WebSocket): void {
    for (const [submissionId, clients] of subscriptions.entries()) {
        if (clients.has(ws)) {
            clients.delete(ws);
            
            // Garbage Collection: Remove the submissionId key completely if no subscribers remain
            if (clients.size === 0) {
                subscriptions.delete(submissionId);
            }
        }
    }
    console.log("[WS] Cleaned up disconnected subscription.");
}

export function sendToSubscribers(submissionId: string, message: WSMessage): void {
    const clients = subscriptions.get(submissionId);
    
    if (!clients || clients.size === 0) {
        console.log(`[WS] No subscribers for: ${submissionId}. Skipping notification push.`);
        return;
    }

    const payload = JSON.stringify(message);

    for (const ws of clients) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(payload);
        }
    }
}