import express, { Express } from "express";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import connectDB from "./config/db-connect";
import cors from "cors";
import routes from "./routes/user";
import { MessageModel } from "./models/message";
import { evaluate } from "mathjs";

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
});

function isValidOperationFormat(input: string) {
  // Regular expression to match the format "/operation expression"
  const regex = /^\/operation\s[\s\S]+$/;
  if (!regex.test(input)) {
    return false;
  }

  const expression = input.slice("/operation ".length);
  try {
    const result = evaluate(expression);
    return { expression, result };
  } catch (error: any) {
    return false;
  }
}

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  socket.on("join", async ({ userID, socketID }) => {
    try {
      let messages = await MessageModel.find({ user: userID });
      io.to(socketID).emit("previousMessage", messages);
    } catch (error) {}
  });
  socket.on("sendMessage", async ({ socketID, newMessage }) => {
    try {
      let isOperation = false;
      let reply: String | null = null;
      let found = [];
      if (newMessage.text === "/history") {
        found = await MessageModel.find({
          isOperation: true,
          user: newMessage.user,
        })
          .sort({ createdAt: -1 })
          .limit(10);

        const history: string[] = [];
        found.map((item) => {
          history.push(`${item.text}\n`);
        });

        if (history.length === 0) {
          reply = "There's no calculation history";
        } else {
          reply = `Calculation History:\n${history.join("")}`;
        }
      } else {
        let ans = isValidOperationFormat(newMessage.text);
        if (ans === false) {
          reply = "Sorry invalid command";
        } else {
          isOperation = true;
          const { result, expression } = ans;
          reply = `${expression} = ${result}`;
        }
      }

      const msg = await MessageModel.create({
        isUser: newMessage.isUser,
        user: newMessage.user,
        text: newMessage.text,
        createdAt: newMessage.createdAt,
      });

      const replyMessage = await MessageModel.create({
        isUser: false,
        user: newMessage.user,
        text: reply,
        isOperation,
      });
      io.to(socketID).emit("receiveMessage", replyMessage);
    } catch (error) {}
  });
});
