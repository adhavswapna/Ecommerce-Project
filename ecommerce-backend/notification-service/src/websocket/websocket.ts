import { WebSocketServer } from "ws";

let wss: WebSocketServer;

export const initWebSocket = (port: number) => {
  wss = new WebSocketServer({ port });

  wss.on("connection", (ws) => {
    console.log("✅ WS Client connected");

    ws.on("close", () => {
      console.log("❌ WS Client disconnected");
    });
  });

  console.log(`🔔 WebSocket running on ws://localhost:${port}`);
};

export const broadcast = (data: any) => {
  if (!wss) return;

  wss.clients.forEach((client: any) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};
