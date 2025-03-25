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
};

export default channelMemberRoutes;
