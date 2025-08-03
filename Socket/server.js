import { createServer } from "node:http";
import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";

const app = express();

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("chat-message", (msg) => {
    socket.broadcast.emit("chat-message", msg);
  });

  console.log("User is connected");
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "./index.html");

app.get("/", (req, res) => {
  res.sendFile(filePath);
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
