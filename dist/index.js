"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log("Server listening on port " + port);
});
const io = new socket_io_1.Server(server, {
    cors: {
        // credentials: true,
        origin: "*",
    },
});
io.on("connection", (socket) => {
    console.log("client connection", socket.id);
});
