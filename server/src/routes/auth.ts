import { FastifyPluginAsync } from "fastify";
import prisma from "../utils/prisma";
import bcrypt from "bcryptjs";

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/signup", async (req, reply) => {
    const { username, password, displayName } = req.body as {
      username: string;
      password: string;
      displayName: string;
    };

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return reply.status(400).send({ error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashed, displayName },
    });

    const token = app.jwt.sign({
      id: user.id,
      username: user.username,
    });
    return reply.send({ token });
  });

  app.post("/login", async (req, reply) => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = app.jwt.sign({
      id: user.id,
      username: user.username,
    });
    return reply.send({ token });
  });

  app.get("/me", async (req, reply) => {
    try {
      const authHeader = req.headers.authorization?.split(" ")[1];
      if (!authHeader)
        return reply.status(401).send({ error: "Missing token" });

      const decoded = app.jwt.verify<{ id: string }>(authHeader);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      if (!user) return reply.status(404).send({ error: "User not found" });

      return reply.send({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
      });
    } catch {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });
};

export default authRoutes;
