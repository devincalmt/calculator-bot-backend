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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../models/user");
const message_1 = require("../models/message");
const constants_1 = require("../constants");
const router = (0, express_1.Router)();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res
                .status(400)
                .json({ success: false, message: "Please enter a valid email." });
        }
        let findUser = yield user_1.UserModel.findOne({ email });
        if (!findUser) {
            findUser = yield user_1.UserModel.create({ email });
            let message = yield message_1.MessageModel.create({
                user: findUser._id,
                isUser: false,
                text: constants_1.welcomeMessage,
            });
        }
        return res.status(200).json({ success: true, data: findUser._id });
    }
    catch (error) {
        let errorMessage = "Server Error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(500).json({ success: false, message: errorMessage });
    }
}));
exports.default = router;
