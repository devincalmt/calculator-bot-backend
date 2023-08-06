"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./user");
const message = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: user_1.UserModel,
    },
    isUser: {
        type: Boolean,
        required: true,
    },
    text: {
        type: String,
    },
}, {
    timestamps: true,
});
const MessageModel = mongoose_1.default.model("message", message);
exports.MessageModel = MessageModel;
