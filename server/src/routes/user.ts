import { FastifyPluginAsync } from "fastify";
import prisma from "../utils/prisma";

// **User**
// - [x] **GET /api/users**: Retrieve a list of all users.
// - [x] **GET /api/users/:id**: Retrieve a specific user by ID.
// - **PUT /api/users/:id**: Update a user's information.
// - **DELETE /api/users/:id**: Delete a user.

interface UserParams {
  id: string;
}

interface UpdateUserBody {
  username?: string;
  password?: string;
  displayName?: string;
}

const userRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (_, reply) => {
    const users = await prisma.user.findMany();
    return reply.send(users);
  });

  app.get<{ Params: UserParams }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return reply.status(404).send({ error: "User not found" });
    return reply.send(user);
  });

  app.put<{ Params: UserParams; Body: UpdateUserBody }>(
    "/:id",
    async (request, reply) => {
      const { id } = request.params;
      const { username, password, displayName } = request.body;
      const user = await prisma.user.update({
        where: { id },
        data: { username, password, displayName },
      });
      return reply.send(user);
    },
  );

  app.delete<{ Params: UserParams }>("/:id", async (request, reply) => {
    const { id } = request.params;
    await prisma.user.delete({ where: { id } });
    return reply.status(204).send();
  });
};

export default userRoutes;
