import { FastifyPluginAsync } from "fastify";
import prisma from "../utils/prisma";
import { requireAuth } from "../utils/middleware";

const messageRoutes: FastifyPluginAsync = async (app) => {
  // TODO: add auth check using JWT
  app.get("/", { preHandler: requireAuth }, async (req, reply) => {
    const channelId = (req.query as { channelId?: string })?.channelId;

    const messages = await prisma.message.findMany({
      where: channelId ? { channelId } : undefined,
      orderBy: { createdAt: "asc" },
    });

    return reply.send(messages);
  });
};

export default messageRoutes;
