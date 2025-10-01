import crypto from "crypto";
import path from "path";
import fs from "fs-extra";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import { TicketRepository } from "../repositories/ticket.repository.js";
import { Types } from "mongoose";

interface BookTicketParams {
    eventId: string;
    userId: string;
    quantity: number;
}

export default class TicketService {
    constructor(private ticketRepository = TicketRepository) {}

    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    async bookTicket({ eventId, userId, quantity }: BookTicketParams) {
        const event = await this.ticketRepository.findEventById(eventId);
        if (!event) throw new Error("Event not found");

        if (event.sold + quantity > event.capacity) {
            throw new Error("Not enough tickets available");
        }

        const tickets = [];

        // Directory to store QR images
        const qrDir = path.join(process.cwd(), "uploads", "qrcodes");
        await fs.ensureDir(qrDir);

        for (let i = 0; i < quantity; i++) {
            const code = crypto.randomBytes(16).toString("hex");
            const orderId = crypto.randomUUID();

            // File path for QR code image
            const qrFileName = `${code}.png`;
            const qrFilePath = path.join(qrDir, qrFileName);

            // Generate QR code as PNG file
            await QRCode.toFile(qrFilePath, code);

            const ticket = await this.ticketRepository.create({
                event: eventId,
                owner: userId,
                orderId,
                code,
                qrData: qrFilePath, // store path in DB
            });

            const user = await this.ticketRepository.findUserById(userId);
            if (user && user.email) {
                await this.transporter.sendMail({
                    from: `"Event Tickets" <${process.env.SMTP_USER}>`,
                    to: user.email,
                    subject: `Your Ticket for ${event.title}`,
                    html: `
                        <h2>Booking Confirmed!</h2>
                        <p>Event: <b>${event.title}</b></p>
                        <p>Order ID: <b>${orderId}</b></p>
                        <p>Ticket Code: <b>${code}</b></p>
                        <p>Show this QR code at entry:</p>
                        <img src="cid:${code}" />
                    `,
                    attachments: [
                        {
                            filename: qrFileName,
                            path: qrFilePath,
                            cid: code, // same as src in <img>
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

    // Get tickets for a user
    async getUserTickets(userId: string) {
        return this.ticketRepository.findByUser(userId);
    }

    // Cancel a ticket
    async cancelTicket(ticketId: string) {
        const ticket = await this.ticketRepository.findById(ticketId);
        if (!ticket) throw new Error("Ticket not found");
        if (ticket.status !== "active") throw new Error("Ticket cannot be cancelled");

        // ✅ Decrease sold count when cancelled
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

    // Validate a ticket
    async validateTicket(ticketId: string) {
        const ticket = await this.ticketRepository.findById(ticketId);
        if (!ticket) throw new Error("Ticket not found");

        if (ticket.status === "used") throw new Error("Ticket already used");
        if (ticket.status !== "active") throw new Error("Ticket invalid");

        return this.ticketRepository.update(ticketId, { status: "used" });
    }
}
