import mongoose from "mongoose";
import { UserModel } from "./user";

const message = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: UserModel,
    },
    isUser: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
    },
    isOperation: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("message", message);

export { MessageModel };
