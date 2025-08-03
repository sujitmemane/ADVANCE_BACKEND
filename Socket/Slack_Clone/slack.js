import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import namespaces from "./data/namespaces.js";
import Room from "./classes/Room.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, "public")));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/change-ns", (req, res) => {
  namespaces[0].addRoom(new Room(0, "Deleted articles", 0));
  io.of(namespaces[0].path).emit("nsChange", namespaces[0]);
  res.json({ message: "Namespace changed", data: namespaces[0] });
});

io.of("/").on("connection", (socket) => {
  socket.emit("welcome", "Welcome to our websocket server");
  console.log(socket.handshake.query);
  socket.emit("nsList", namespaces);
});

namespaces.forEach((ns) => {
  const namespace = io.of(ns.path);
  namespace.on("connection", (socket) => {
    console.log(`🔌 User connected to namespace: ${ns.path}`);

    socket.on(
      "joinRoom",
      async ({ roomName: roomTitle, namespaceId }, ackCB) => {
        const rooms = socket.rooms;
        for (const room of rooms) {
          if (room !== socket.id) {
            socket.leave(room);
          }
        }

        const thisNs = namespaces[namespaceId];
        const thisRoom = thisNs.rooms.find((r) => r.roomTitle === roomTitle);
        const thisRoomHistory = thisRoom.history;

        socket.join(roomTitle);

        const sockets = await namespace.in(roomTitle).fetchSockets();
        const numUsers = sockets.length;

        if (typeof ackCB === "function") {
          ackCB({ numUsers, thisRoomHistory });
        } else {
          console.warn("⚠️ No ackCB provided for joinRoom");
        }
      }
    );

    socket.on("newMessageToRoom", (mssgObj) => {
      const room = [...socket.rooms][1];
      console.log(mssgObj);
      io.of(ns.path).in(room).emit("messageToRoom", mssgObj);
      const thisNs = namespaces[mssgObj.selectedNsId];
      console.log(thisNs, room);
      const thisRoom = thisNs.rooms.find((r) => r.roomTitle === room);
      thisRoom.addMessage(mssgObj);
    });
  });
});

server.listen(4000, () => {
  console.log("Server listening on http://localhost:4000");
});
