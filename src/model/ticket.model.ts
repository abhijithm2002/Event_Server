import { Schema, model } from "mongoose";
import { ITicket } from "./interfaces/modal.interfaces.js";

const ticketSchema = new Schema<ITicket>({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  qrData: { type: String },
  pdfUrl: { type: String },
  status: {
    type: String,
    enum: ["active", "used", "cancelled", "refunded"],
    default: "active",
  },
}, { timestamps: true });

export const TicketModel = model<ITicket>("Ticket", ticketSchema);
