import { Request, Response, Router } from "express";
import { UserModel } from "../models/user";
import { MessageModel } from "../models/message";
import { welcomeMessage } from "../constants";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email." });
    }

    let findUser = await UserModel.findOne({ email });

    if (!findUser) {
      findUser = await UserModel.create({ email });
      let message = await MessageModel.create({
        user: findUser._id,
        isUser: false,
        text: welcomeMessage,
      });
    }

    return res.status(200).json({ success: true, data: findUser._id });
  } catch (error) {
    let errorMessage = "Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ success: false, message: errorMessage });
  }
});

export default router;
