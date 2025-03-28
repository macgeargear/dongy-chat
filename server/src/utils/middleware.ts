import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "./prisma";

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return reply.status(401).send({ error: "Missing token" });

    const decoded = req.server.jwt.verify<{
      id: string;
      username: string;
    }>(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    (req as any).user = user;
  } catch {
    return reply.status(401).send({ error: "Invalid token" });
  }
}
