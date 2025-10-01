import { Router } from "express";
import TicketController from "../controller/ticket.controller.js";
import { verifyJwt } from "../middleware/auth.jwt.js";
const router = Router();

const ticketController = new TicketController()


router.post("/bookTicket",verifyJwt, ticketController.bookTicket.bind(ticketController));


export const ticketRoutes = router;



// import crypto from "crypto";
// import { TicketRepository } from "../repositories/ticket.repository.js";

// interface BookTicketParams {
//   eventId: string;
//   userId: string;
// }

// export const TicketService = {
//   async bookTicket({ eventId, userId }: BookTicketParams) {
//     const event = await TicketRepository.findEventById(eventId);
//     if (!event) throw new Error("Event not found");

//     if (event.sold >= event.quantity) throw new Error("Tickets sold out");

//     const code = crypto.randomBytes(16).toString("hex");
//     const orderId = crypto.randomUUID();

//     const ticket = await TicketRepository.create({
//       event: eventId,
//       owner: userId,
//       orderId,
//       code,
//       qrData: code,
//     });

//     event.sold += 1;
//     await event.save();

//     return ticket;
//   },

//   async getUserTickets(userId: string) {
//     return TicketRepository.findByUser(userId);
//   },

//   async cancelTicket(ticketId: string) {
//     const ticket = await TicketRepository.findById(ticketId);
//     if (!ticket) throw new Error("Ticket not found");
//     if (ticket.status !== "active") throw new Error("Ticket cannot be cancelled");

//     return TicketRepository.update(ticketId, { status: "cancelled" });
//   },

//   async validateTicket(ticketId: string) {
//     const ticket = await TicketRepository.findById(ticketId);
//     if (!ticket) throw new Error("Ticket not found");

//     if (ticket.status === "used") throw new Error("Ticket already used");
//     if (ticket.status !== "active") throw new Error("Ticket invalid");

//     return TicketRepository.update(ticketId, { status: "used" });
//   },
// };


/////////////// controller


// controllers/ticket.controller.ts
// import { Request, Response } from "express";
// import { TicketService } from "../service/ticket.service.js";

// export default class EventController {
//     private ticketservice : TicketService;

//     constructor() {
//         this.ticketservice = new TicketService();
//     }
//     async bookTicket = async (req: Request, res: Response) => {
//         try {
//             const { eventId, userId } = req.body;
//             console.log('book ticket body', req.body)
//             const ticket = await TicketService.bookTicket({ eventId, userId });
//             res.status(201).json(ticket);
//         } catch (err: any) {
//             res.status(400).json({ error: err.message });
//         }
//     };

//     async getMyTickets = async (req: Request, res: Response) => {
//         try {
//             const tickets = await TicketService.getUserTickets(req.params.userId);
//             res.json(tickets);
//         } catch (err: any) {
//             res.status(400).json({ error: err.message });
//         }
//     };

//     async cancelTicket = async (req: Request, res: Response) => {
//         try {
//             const ticket = await TicketService.cancelTicket(req.params.ticketId);
//             res.json(ticket);
//         } catch (err: any) {
//             res.status(400).json({ error: err.message });
//         }
//     };

//     async validateTicket = async (req: Request, res: Response) => {
//         try {
//             const ticket = await TicketService.validateTicket(req.params.ticketId);
//             res.json(ticket);
//         } catch (err: any) {
//             res.status(400).json({ error: err.message });
//         }
//     };

// }
