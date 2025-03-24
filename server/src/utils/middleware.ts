import { FastifyRequest, FastifyReply } from "fastify";

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return reply.status(401).send({ error: "Missing token" });

    const user = req.server.jwt.verify<{
      id: string;
      username: string;
      role: string;
    }>(token);

    // Optional: attach user to the request
    (req as any).user = user;
  } catch {
    return reply.status(401).send({ error: "Invalid token" });
  }
}
