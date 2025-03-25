// **Channel**
// - **GET /api/channelMember**: Retrieve a list of all channels.
// - **GET /api/channelMember/?userId,channelId**: Retrieve a specific channel by ID.
// - **POST /api/channelMember**: Create a new channel.
// - **PUT /api/channelMember/:id**: Update a channel's information.
// - **DELETE /api/channelMember/:id**: Delete a channel.
// - **POST /api/channelMember/user/**: Add a user to a channel.
// - **DELETE /api/channelMember/uesr/:user_id?channelid**: Remove a user from a channel.
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
};

export default channelMemberRoutes;
