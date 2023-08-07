import express, { Express } from "express";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import connectDB from "./config/db-connect";
import cors from "cors";
import routes from "./routes/user";
import { MessageModel } from "./models/message";
import math from "mathjs";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

const port = process.env.PORT || 5000;

const server = app.listen(port, async () => {
  const DB_URI =
    process.env.DB_URI || "mongodb://localhost:27017/bot_calculator";
  await connectDB(DB_URI);
  console.log("connected to MongoDB");
  console.log("Server listening on port " + port);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const isValidOperationFormat = (input: string) => {
  // Regular expression to match the format "/operation expression"
  const regex = /^\/operation\s[\s\S]+$/;
  if (!regex.test(input)) {
    return false;
  }

  const expression = input.slice("/operation ".length);
  try {
    const result = math.evaluate(expression);
    return { expression, result };
  } catch (error) {
    return false;
  }
};

io.on("connection", (socket: Socket) => {
  socket.on("join", async ({ userID, socketID }) => {
    try {
      console.log("client connection", socket.id);
      let messages = await MessageModel.find({ user: userID });
      io.to(socketID).emit("previousMessage", messages);
    } catch (error) {}
  });

  socket.on("sendMessage", async ({ socketID, userID, text }) => {
    try {
      let isOperation = false;
      let reply = null;
      if (text === "/history") {
        reply = await MessageModel.find({ isOperation: true, user: userID })
          .sort({ createdAt: -1 })
          .limit(10);
      } else {
        let ans = isValidOperationFormat(text);
        if (ans === false) {
          reply = "Sorry invalid command";
        } else {
          isOperation = true;
          const { result, expression } = ans;
          reply = `${expression} = ${result}`;
        }
      }

      const newMessage = await MessageModel.create({
        isUser: true,
        user: userID,
        text,
      });
      io.to(socketID).emit("receiveMessage", newMessage);
      const replyMessage = await MessageModel.create({
        isUser: false,
        user: userID,
        text: reply,
        isOperation,
      });
      io.to(socketID).emit("receiveMessage", replyMessage);
    } catch (error) {}
  });
});
