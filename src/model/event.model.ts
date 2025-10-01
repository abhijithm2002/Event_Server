import { Schema, model } from "mongoose";
import { IEvent } from "./interfaces/modal.interfaces.js";

const eventSchema = new Schema<IEvent>(
  {
    organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    venue: { type: String },
    address: { type: String },
    startAt: { type: Date, required: true },
    endAt: { type: Date },
    images: [{ type: String }],
    capacity: { type: Number,required: true },
    status: { type: String, enum: ["draft", "published", "cancelled"], default: "draft" },
    price: { type: Number},      // Ticket price
    currency: { type: String, required: true },   // Ticket currency
    quantity: { type: Number, required: true },   // Total tickets available
    sold: { type: Number, default: 0 },           // Tickets sold
    
  },
  { timestamps: true }
);

export const EventModel = model<IEvent>("Event", eventSchema);
