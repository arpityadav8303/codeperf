// backend/src/services/notification.service.ts
import WebSocket from "ws";

// 1. Type Definitions - WSMessage Discriminated Union

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

// 2. The Subscriptions Map - Linking submissionId (UUID) to a Set of WebSocket connections
// Using a Set instead of an Array allows O(1) hash-based lookups and automatic deduplication
const subscriptions = new Map<string, Set<WebSocket>>();

/**
 * Registers a client WebSocket connection to receive live updates for a specific submission
 */
export function subscribe(submissionId: string, ws: WebSocket): void {
    if (!subscriptions.has(submissionId)) {
        subscriptions.set(submissionId, new Set<WebSocket>());
    }
    
    subscriptions.get(submissionId)!.add(ws);
    
    console.log(`[WS] Subscribed to: ${submissionId}. Total subscribers: ${subscriptions.get(submissionId)!.size}`);
}

/**
 * Cleans up a WebSocket subscription entirely across all active map entries when a client disconnects.
 * This prevents dead WebSocket references from causing memory leaks in the long-running Node process.
 */
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

/**
 * Pushes real-time events from the BullMQ background worker down to all connected clients.
 * It serializes the message and strictly checks the readyState to ensure the server doesn't crash.
 */
export function sendToSubscribers(submissionId: string, message: WSMessage): void {
    const clients = subscriptions.get(submissionId);
    
    if (!clients || clients.size === 0) {
        console.log(`[WS] No subscribers for: ${submissionId}. Skipping notification push.`);
        return;
    }

    const payload = JSON.stringify(message);

    for (const ws of clients) {
        // CRITICAL CRASH PROTECTION: ws.send() called on a CLOSING or CLOSED socket throws an error.
        // If uncaught, it kills the BullMQ worker process, freezing pending submissions forever.
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(payload);
        }
    }
}