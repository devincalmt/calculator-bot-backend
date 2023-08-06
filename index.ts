import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io'

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log("Server listening on port " + port);
});

const io = new Server(server, {
  cors: {
    // credentials: true,
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  console.log("client connection", socket.id);
});