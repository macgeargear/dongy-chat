import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import fastifyIO from "fastify-socket.io";
import { registerSocket } from "./plugin/socket";
import authRoutes from "./routes/auth";
import messageRoutes from "./routes/message";
import channelRoutes from "./routes/channel";
import channelMemberRoutes from "./routes/channel-member";
import userRoutes from "./routes/user";

dotenv.config();

const app = Fastify();

app.register(cors, { origin: true, methods: ["GET", "POST", "PUT", "DELETE"] });
app.register(jwt, { secret: process.env.JWT_SECRET! });
app.register(fastifyIO);

app.ready().then(() => {
  registerSocket(app);
});

app.register(userRoutes, { prefix: "/api/user" });
app.register(authRoutes, { prefix: "/api/auth" });
app.register(messageRoutes, { prefix: "/api/message" });
app.register(channelRoutes, { prefix: "/api/channel" });
app.register(channelMemberRoutes, { prefix: "/api/channel-member" });

const start = async () => {
  try {
    await app.listen({ port: 3006, host: "0.0.0.0" });
    console.log(`Server listening on ${app.server.address()}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
