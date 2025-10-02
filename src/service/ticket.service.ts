import crypto from "crypto";
import QRCode from "qrcode";
import { TicketRepository } from "../repositories/ticket.repository.js";
import { Types } from "mongoose";
import { Resend } from "resend";

interface BookTicketParams {
    eventId: string;
    userId: string;
    quantity: number;
}

export default class TicketService {
    constructor(private ticketRepository = TicketRepository) { }

    private resend = new Resend(process.env.RESEND_API_KEY);

    async bookTicket({ eventId, userId, quantity }: BookTicketParams) {
        const event = await this.ticketRepository.findEventById(eventId);
        if (!event) throw new Error("Event not found");

        if (event.sold + quantity > event.capacity) {
            throw new Error("Not enough tickets available");
        }

        const tickets = [];

        for (let i = 0; i < quantity; i++) {
            const code = crypto.randomBytes(16).toString("hex");
            const orderId = crypto.randomUUID();

            // Generate QR as Base64
            const qrBase64 = await QRCode.toDataURL(code);
            const qrImageBase64 = qrBase64.split(",")[1]; // remove prefix

            const ticket = await this.ticketRepository.create({
                event: eventId,
                owner: userId,
                orderId,
                code,
                qrData: qrBase64, // store base64 if needed
            });

            const user = await this.ticketRepository.findUserById(userId);
            if (user && user.email) {
                await this.resend.emails.send({
                    from: "Event Tickets <onboarding@resend.dev>",
                    to: user.email,
                    subject: `Your Ticket for ${event.title}`,
                    html: `
                        <h2>Booking Confirmed!</h2>
                        <p>Event: <b>${event.title}</b></p>
                        <p>Order ID: <b>${orderId}</b></p>
                        <p>Ticket Code: <b>${code}</b></p>
                        <p>Your ticket QR is attached as a file.</p>`,
                    attachments: [
                        {
                            filename: `${code}.png`,
                            content: qrImageBase64, // just the base64 string
                        },
                    ],
                });

            }

            tickets.push(ticket);
        }

        event.sold += quantity;
        await event.save();

        return tickets;
    }

    async getUserTickets(userId: string) {
        return this.ticketRepository.findByUser(userId);
    }

    async cancelTicket(ticketId: string) {
        const ticket = await this.ticketRepository.findById(ticketId);
        if (!ticket) throw new Error("Ticket not found");
        if (ticket.status !== "active") throw new Error("Ticket cannot be cancelled");

        let eventId: string;
        if (typeof ticket.event === "string") {
            eventId = ticket.event;
        } else if (ticket.event instanceof Types.ObjectId) {
            eventId = ticket.event.toString();
        } else {
            eventId = ticket.event._id!.toString();
        }

        const event = await this.ticketRepository.findEventById(eventId);
        if (event) {
            event.sold = Math.max(0, event.sold - 1);
            await event.save();
        }

        return this.ticketRepository.update(ticketId, { status: "cancelled" });
    }

    async validateTicket(ticketId: string) {
        const ticket = await this.ticketRepository.findById(ticketId);
        if (!ticket) throw new Error("Ticket not found");

        if (ticket.status === "used") throw new Error("Ticket already used");
        if (ticket.status !== "active") throw new Error("Ticket invalid");

        return this.ticketRepository.update(ticketId, { status: "used" });
    }
}
