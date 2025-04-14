import { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import prisma from "../utils/prisma";
import { User } from "@prisma/client";

export const activeUsers: Record<
  string, // channelId
  { socketId: string; user: User }[]
> = {};

let onlineUsers: { user: User; socketId: string }[] = [];

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

  io.on("connection", async (socket) => {
    const userId = socket.data.user.id;
    const user = await prisma.user.findFirst({ where: { id: userId } });

    console.log(user);
    // console.log(`${user!.username} connected [${socket.id}]`);

    socket.on("get-users-request", () => {
      socket.emit("get-users", onlineUsers);
    });

    socket.on("new-user-add", (newUser) => {
      if (!onlineUsers.some((ou) => ou.user.id === newUser.id)) {
        // if user is not added before
        onlineUsers.push({ user: newUser, socketId: socket.id });
        console.log("new user is here!", onlineUsers);
      }
      // send all active users to new user
      io.emit("get-users", onlineUsers);
    });

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
        id,
      }: {
        channelId: string;
        content: string;
        id: string;
      }) => {
        io.to(channelId).emit("receive_message", {
          id,
          content,
          channelId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          senderId: user!.id,
          sender: user,
          channel: { id: channelId }, // minimal info to render
        });

        await prisma.message.create({
          data: {
            id,
            senderId: user!.id,
            channelId,
            content,
          },
          include: {
            sender: true,
            channel: true,
          },
        });
      },
    );

    // Typing events
    socket.on("typing", (channelId: string) => {
      socket.to(channelId).emit("typing", { username: user!.username });
    });

    socket.on("stop_typing", (channelId: string) => {
      socket.to(channelId).emit("stop_typing", { username: user!.username });
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

      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      console.log("user disconnected", onlineUsers);
      // send all online users to all users
      io.emit("get-users", onlineUsers);
    });

    socket.on("offline", () => {
      // remove user from active users
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      console.log("user is offline", onlineUsers);
      // send all online users to all users
      io.emit("get-users", onlineUsers);
    });
  });
}
