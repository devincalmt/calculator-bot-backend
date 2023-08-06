import mongoose from 'mongoose';

const user = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", user);

export { UserModel }