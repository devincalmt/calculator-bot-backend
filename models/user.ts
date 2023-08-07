import mongoose from "mongoose";

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

user.pre("save", function (next) {
  this.email = this.email.toLowerCase();
  next();
});

const UserModel = mongoose.model("user", user);

export { UserModel };
