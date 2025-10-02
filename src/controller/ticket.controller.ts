import { Request, Response, NextFunction } from "express";
import TicketService from "../service/ticket.service.js";

export default class TicketController {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  // Book ticket(s)
  async bookTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { eventId, userId, quantity } = req.body;
      console.log('book ticket data', req.body)
      const tickets = await this.ticketService.bookTicket({ eventId, userId, quantity });
      res.status(201).json({ message: "Tickets booked successfully", tickets });
    } catch (error: any) {
      console.error("Error in bookTicket:", error);
      res.status(400).json({ message: error.message || "Failed to book ticket" });
    }
  }

  async getMyTickets(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const tickets = await this.ticketService.getUserTickets(userId);
      res.status(200).json(tickets);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to fetch tickets" });
    }
  }

  async cancelTicket(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const ticket = await this.ticketService.cancelTicket(ticketId);
      res.status(200).json({ message: "Ticket cancelled successfully", ticket });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to cancel ticket" });
    }
  }

  async validateTicket(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const ticket = await this.ticketService.validateTicket(ticketId);
      res.status(200).json({ message: "Ticket validated successfully", ticket });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to validate ticket" });
    }
  }
}
