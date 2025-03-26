// **Message**
// - **GET /api/message**: Retrieve a list of all messages.
// - **GET /api/messages/:id**: Retrieve a specific message by ID.
// - **POST /api/messages**: Create a new message.
// - **DELETE /api/messages/:id**: Delete a message.
import { FastifyPluginAsync } from "fastify";
import prisma from "../utils/prisma";
import { requireAuth } from "../utils/middleware";

const messageRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", { preHandler: requireAuth }, async (_, reply) => {
    try {
      const messages = await prisma.message.findMany();
      return reply.status(200).send(messages);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Failed to retrieve all messages." });
    }
  });

  app.get("/:id", { preHandler: requireAuth }, async (req, reply) => {
    const { id: messageId } = req.params as { id: string };
    if (!messageId) return reply.status(400).send({ error: "Invalid input" });
    try {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: {
          channel: true,
          sender: true,
        },
      });
      if (!message) {
        return reply.status(404).send({ error: "Message not found." });
      }
      return reply.status(200).send(message);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Failed to retrieve all messages." });
    }
  });
  app.post("/", { preHandler: requireAuth }, async (req, reply) => {
    const { channelId, content, senderId } = req.body as {
      channelId: string;
      content: string;
      senderId: string;
    };

    if (!channelId || !content || !senderId) {
      return reply.status(400).send({ error: "Invalid input." });
    }
    if (content === "") {
      return reply
        .status(400)
        .send({ error: "Content cannot be empty string" });
    }
    try {
      const newMessage = await prisma.message.create({
        data: {
          channelId: channelId,
          content: content,
          senderId: senderId,
        },
      });

      return reply.send(201).send(newMessage);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to send a message." });
    }
  });

  app.delete("/:id", { preHandler: requireAuth }, async (req, reply) => {
    const { id: messageId } = req.params as { id: string };
    try {
      const deletedMessage = await prisma.message.delete({
        where: {
          id: messageId,
        },
      });
      return reply.status(200).send(deletedMessage);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to delete a message." });
    }
  });
};

export default messageRoutes;
