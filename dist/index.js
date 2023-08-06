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
const constants_1 = require("./constants");
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
io.on("connection", (socket) => {
    console.log("client connection", socket.id);
    socket.on("join", ({ userID, socketID }) => __awaiter(void 0, void 0, void 0, function* () {
        let messages = yield message_1.MessageModel.find({ user: userID });
        if (messages.length === 0) {
            let message = new message_1.MessageModel({
                user: userID,
                isUser: false,
                text: constants_1.welcomeMessage,
            });
            messages.push(message);
        }
        io.to(socketID).emit("previousMessage", messages);
    }));
});
