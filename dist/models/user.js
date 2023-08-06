"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, { timestamps: true });
user.pre("save", function (next) {
    this.email = this.email.toLowerCase();
    next();
});
const UserModel = mongoose_1.default.model("user", user);
exports.UserModel = UserModel;
