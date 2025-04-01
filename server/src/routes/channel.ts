// **Channel**
// - **GET /api/channels**: Retrieve a list of all channels.
// - **GET /api/channels/:id**: Retrieve a specific channel by ID.
// - **POST /api/channels**: Create a new channel.
// - **PUT /api/channels/:id**: Update a channel's information.
// - **DELETE /api/channels/:id**: Delete a channel.
// - **POST /api/channels/user/**: Add a user to a channel.
// - **DELETE /api/channels/uesr/:user_id?channelid**: Remove a user from a channel.
import { FastifyPluginAsync } from "fastify";
import prisma from "../utils/prisma";
import { requireAuth } from "../utils/middleware";

const channelRoutes: FastifyPluginAsync = async (app) => {
  // Get all channels
  app.get("/", { preHandler: requireAuth }, async (_, reply) => {
    try {
      const allChannels = await prisma.channel.findMany({
        include: {
          messages: true,
          channelMembers: {
            include: {
              user: true,
            },
          },
        },
      });
      return reply.status(200).send(allChannels);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to retrieve channels." });
    }
  });

  app.get("/:id", { preHandler: requireAuth }, async (req, reply) => {
    const { id: channelId } = req.params as { id: string };
    if (!channelId) return reply.status(400).send({ error: "Invalid input" });
    try {
      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        include: {
          channelMembers: {
            include: {
              user: true,
            },
          },
          messages: {
            include: {
              sender: true,
            },
          },
        },
      });
      if (!channel) {
        return reply.status(404).send({ error: "Channel not found." });
      }
      return reply.status(200).send(channel);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Failed to retrieve the channel." });
    }
  });

  // Create a new channel
  app.post("/", { preHandler: requireAuth }, async (req, reply) => {
    const { name, isPrivate, userIds } = req.body as {
      name: string;
      isPrivate: boolean;
      userIds: string[];
    };

    if (typeof isPrivate === "undefined" || userIds.length == 0) {
      return reply.status(400).send({ error: "Invalid input." });
    }
    if (userIds.length > 2 && isPrivate) {
      return reply
        .status(400)
        .send({ error: "Private chat cannot exceed 2 members" });
    }
    try {
      const newChannel = await prisma.channel.create({
        data: {
          name,
          isPrivate,
        },
      });

      if (userIds && userIds.length > 0) {
        const channelMembers = userIds.map((userId) => ({
          channelId: newChannel.id,
          userId: userId,
          latestSeenMessageId: "",
        }));

        await prisma.channelMember.createMany({
          data: channelMembers,
        });
      }
      const fullChannel = await prisma.channel.findUnique({
        where: { id: newChannel.id },
        include: { channelMembers: true },
      });

      return reply.status(201).send(fullChannel);
    } catch (error) {
      console.error("Error creating channel:", error);
      return reply.status(500).send({ error: "Failed to create channel." });
    }
  });
  // Update a channel
  app.put("/:id", { preHandler: requireAuth }, async (req, reply) => {
    const { id: channelId } = req.params as { id: string };
    const { name, theme } = req.body as {
      name: string | undefined;
      theme: string | undefined;
    };
    if (!channelId) return reply.status(400).send({ error: "Invalid input" });
    try {
      const updatedChannel = await prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          name,
          theme,
        },
      });
      return reply.status(200).send(updatedChannel);
    } catch (error) {
      console.error("Error updating channel:", error);
      return reply.status(500).send({ error: "Failed to update the channel." });
    }
  });
  app.delete("/:id", { preHandler: requireAuth }, async (req, reply) => {
    const { id: channelId } = req.params as { id: string };
    try {
      await prisma.channelMember.deleteMany({
        where: {
          channelId: channelId,
        },
      });

      const deletedChannel = await prisma.channel.delete({
        where: {
          id: channelId,
        },
      });
      return reply.status(200).send(deletedChannel);
    } catch (error) {
      console.error("Error deleting channel:", error);
      return reply.status(500).send({ error: "Failed to delete the channel." });
    }
  });
};

export default channelRoutes;
