import { WebSocketServer, WebSocket } from "ws";

let wss: WebSocketServer;

// 🔥 store user connections
const userSockets = new Map<string, WebSocket>();

export const initWebSocket = (port: number) => {
  wss = new WebSocketServer({ port });

  wss.on("connection", (ws, req) => {
    // 👇 get userId from query
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const userId = url.searchParams.get("userId");

    if (userId) {
      userSockets.set(userId, ws);
      console.log(`✅ User connected: ${userId}`);
    }

    ws.on("close", () => {
      if (userId) {
        userSockets.delete(userId);
        console.log(`❌ User disconnected: ${userId}`);
      }
    });
  });

  console.log(`🔔 WebSocket running on ws://localhost:${port}`);
};
