import { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import prisma from "../utils/prisma";

export function registerSocket(app: FastifyInstance) {
  // const io: Server = app.io;
  const io = (app as any).io as Server;

  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = app.jwt.verify(token) as {
        id: string;
        username: string;
        role: string;
      };
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    console.log(`${user.username} connected [${socket.id}]`);

    // Join room
    socket.on("join_room", (channelId: string) => {
      socket.join(channelId);
      console.log(`${user.username} joined room ${channelId}`);
    });

    // Send message to room
    socket.on(
      "send_message",
      async ({
        channelId,
        content,
      }: {
        channelId: string;
        content: string;
      }) => {
        const message = await prisma.message.create({
          data: {
            userId: user.id,
            channelId,
            content,
          },
        });

        io.to(channelId).emit("receive_message", message);
      }
    );

    // Typing events
    socket.on("typing", (channelId: string) => {
      socket.to(channelId).emit("typing", { username: user.username });
    });

    socket.on("stop_typing", (channelId: string) => {
      socket.to(channelId).emit("stop_typing", { username: user.username });
    });

    socket.on("admin_announce", (message: string) => {
      if (user.role === "admin") {
        io.emit("admin_announcement", {
          admin: user.username,
          message,
          time: new Date().toISOString(),
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`${user.username} disconnected`);
    });
  });
}
