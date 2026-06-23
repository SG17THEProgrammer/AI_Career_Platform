import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    lastUsedResumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterResume",
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);