import { WebSocketServer, WebSocket } from "ws";

let wss: WebSocketServer;

// store user connections
const userSockets = new Map<string, WebSocket>();

export const initWebSocket = (port: number) => {
  wss = new WebSocketServer({ port });

  wss.on("connection", (ws, req) => {
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

/* =========================
   ✅ ADD THIS (IMPORTANT FIX)
   ========================= */
export const sendToUser = (userId: string, payload: any) => {
  const socket = userSockets.get(userId);

  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.log(`⚠️ User ${userId} not connected`);
    return;
  }

  socket.send(JSON.stringify(payload));
};
