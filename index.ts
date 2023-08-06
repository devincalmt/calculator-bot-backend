import express, { Express } from "express";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import connectDB from "./config/db-connect";
import cors from "cors";
import routes from "./routes/user";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

const port = process.env.PORT || 5000;

const server = app.listen(port, async () => {
  const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/bot_calculator";
  await connectDB(DB_URI);
  console.log("connected to MongoDB");
  console.log("Server listening on port " + port);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  console.log("client connection", socket.id);
});