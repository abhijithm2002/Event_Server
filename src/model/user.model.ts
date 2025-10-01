// src/models/User.ts
import { Schema, model, Document } from "mongoose";
import { IUser } from "./interfaces/modal.interfaces.js";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["attendee", "organizer", "admin"], default: "attendee" },
});

export const UserModel = model<IUser>("User", userSchema);
