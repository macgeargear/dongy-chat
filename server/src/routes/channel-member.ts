// **Channel-Member**
// - **GET /api/channelMember/?userId,channelId**: Retrieve all channel by user_id or all user by channel_id
// - **PUT /api/channelMember/**: Update a channel-member's information.
import { FastifyPluginAsync } from "fastify";
import prisma from "../utils/prisma";
import { requireAuth } from "../utils/middleware";

const channelMemberRoutes: FastifyPluginAsync = async (app) => {
  // Get all channels
  app.get("/", { preHandler: requireAuth }, async (req, reply) => {
    const { userId, channelId } = req.query as {
      userId: string | undefined;
      channelId: string | undefined;
    };
    try {
      const channelMember = await prisma.channelMember.findMany({
        where: {
          userId,
          channelId,
        },
        include: {
          channel: true,
          user: true,
        },
      });
      return reply.status(200).send(channelMember);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to retrieve channels." });
    }
  });

  app.put("/", { preHandler: requireAuth }, async (req, reply) => {
    const { latestSeenMessageId, channelId, userId } = req.body as {
      latestSeenMessageId: string | undefined;
      channelId: string;
      userId: string;
    };
    if (!channelId || !userId)
      return reply.status(400).send({ error: "Invalid input" });
    try {
      const updatedChannelMember = await prisma.channelMember.update({
        where: {
          channelId_userId: {
            channelId,
            userId,
          },
        },
        data: {
          latestSeenMessageId,
        },
      });
      return reply.status(200).send(updatedChannelMember);
    } catch (error) {
      console.error("Error updating channel member:", error);
      return reply
        .status(500)
        .send({ error: "Failed to update the channel member." });
    }
  });
  // Add a user to the channel
  app.post("/", { preHandler: requireAuth }, async (req, reply) => {
    const { userId, channelId } = req.body as {
      userId: string;
      channelId: string;
    };
    if (!userId || !channelId) {
      return reply.status(400).send({ error: "Invalid input." });
    }
    try {
      const channel = await prisma.channel.findFirst({
        where: {
          id: channelId,
        },
      });
      if (!channel)
        return reply.status(404).send({ error: "channel not found" });
      const cnt = await prisma.channelMember.count({
        where: {
          channelId: channelId,
        },
      });
      if (channel.isPrivate && cnt == 2)
        return reply
          .status(500)
          .send({ error: "Private channel cannot exceed 2 members" });
      const newChannelMember = await prisma.channelMember.create({
        data: {
          latestSeenMessageId: "",
          channelId,
          userId,
        },
      });
      return reply.status(200).send(newChannelMember);
    } catch (error) {
      console.error("Error adding new member:", error);
      return reply.status(500).send({ error: "Failed to add member to the channel." });
    }
  });
  app.delete("/:user_id", { preHandler: requireAuth }, async (req, reply) => {
    const { user_id: userId } = req.params as { user_id: string };
    const { channelId } = req.query as { channelId: string };
    if (!channelId || !userId)
      return reply.status(400).send({ error: "Invalid inputs" });

    try {
      const deletedChannelMember = await prisma.channelMember.delete({
        where: {
          channelId_userId: {
            userId,
            channelId,
          },
        },
      });
      return reply.status(200).send(deletedChannelMember);
    } catch (error) {
      console.error("Error deleting channel member:", error);
      return reply
        .status(500)
        .send({ error: "Failed to delete channel member." });
    }
  });
};

export default channelMemberRoutes;
