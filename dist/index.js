"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const db_connect_1 = __importDefault(require("./config/db-connect"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const message_1 = require("./models/message");
const mathjs_1 = __importDefault(require("mathjs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", user_1.default);
const port = process.env.PORT || 5000;
const server = app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/bot_calculator";
    yield (0, db_connect_1.default)(DB_URI);
    console.log("connected to MongoDB");
    console.log("Server listening on port " + port);
}));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
const isValidOperationFormat = (input) => {
    // Regular expression to match the format "/operation expression"
    const regex = /^\/operation\s[\s\S]+$/;
    if (!regex.test(input)) {
        return false;
    }
    const expression = input.slice("/operation ".length);
    try {
        const result = mathjs_1.default.evaluate(expression);
        return { expression, result };
    }
    catch (error) {
        return false;
    }
};
io.on("connection", (socket) => {
    socket.on("join", ({ userID, socketID }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("client connection", socket.id);
            let messages = yield message_1.MessageModel.find({ user: userID });
            io.to(socketID).emit("previousMessage", messages);
        }
        catch (error) { }
    }));
    socket.on("sendMessage", ({ socketID, userID, text }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let isOperation = false;
            let reply = null;
            if (text === "/history") {
                reply = yield message_1.MessageModel.find({ isOperation: true, user: userID })
                    .sort({ createdAt: -1 })
                    .limit(10);
            }
            else {
                let ans = isValidOperationFormat(text);
                if (ans === false) {
                    reply = "Sorry invalid command";
                }
                else {
                    isOperation = true;
                    const { result, expression } = ans;
                    reply = `${expression} = ${result}`;
                }
            }
            const newMessage = yield message_1.MessageModel.create({
                isUser: true,
                user: userID,
                text,
            });
            io.to(socketID).emit("receiveMessage", newMessage);
            const replyMessage = yield message_1.MessageModel.create({
                isUser: false,
                user: userID,
                text: reply,
                isOperation,
            });
            io.to(socketID).emit("receiveMessage", replyMessage);
        }
        catch (error) { }
    }));
});
