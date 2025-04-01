import { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import prisma from "../utils/prisma";
import { User } from "@prisma/client";

export const activeUsers: Record<
  string, // channelId
  { socketId: string; user: User }[]
> = {};

export const allActiveUsers: User[] = [];

export function registerSocket(app: FastifyInstance) {
  // const io: Server = app.io;
  const io = (app as any).io as Server;

  // Auth middleware
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = app.jwt.verify(token) as {
        id: string;
        username: string;
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

    allActiveUsers.push(user);
    socket.on("get_all_active_users", () => {
      socket.emit("all_active_users", allActiveUsers);
    });

    console.log("all-active-users ", allActiveUsers);

    socket.on("join_channel", ({ channelId, user }) => {
      if (!user) return;
      socket.join(channelId);
      const userWithSocket = { user, socketId: socket.id };

      if (!activeUsers[channelId]) {
        activeUsers[channelId] = [];
      }

      const alreadyJoined = activeUsers[channelId].some(
        (u) => u.user.id === user.id,
      );

      if (!alreadyJoined) {
        activeUsers[channelId].push(userWithSocket);
      }

      io.to(channelId).emit("activeUsers", activeUsers[channelId]);
    });

    socket.on("leave_channel", ({ channelId, user }) => {
      if (!user) return;
      if (!activeUsers[channelId]) return;

      activeUsers[channelId] = activeUsers[channelId].filter(
        (u) => u.socketId !== socket.id,
      );

      io.to(channelId).emit("activeUsers", activeUsers[channelId]);
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
            senderId: user.id,
            channelId,
            content,
          },
          include: {
            sender: true,
            channel: true,
          },
        });

        io.to(channelId).emit("receive_message", message);
      },
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
      for (const channelId in activeUsers) {
        const before = activeUsers[channelId].length;
        activeUsers[channelId] = activeUsers[channelId].filter(
          (u) => u.socketId !== socket.id,
        );
        const after = activeUsers[channelId].length;

        if (before !== after) {
          io.to(channelId).emit("activeUsers", activeUsers[channelId]);
        }
      }
    });
  });
}
