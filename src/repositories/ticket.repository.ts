// repositories/ticket.repository.ts
import { TicketModel } from "../model/ticket.model.js";
import { EventModel } from "../model/event.model.js";
import { ITicket } from "../model/interfaces/modal.interfaces.js";
import { UserModel } from "../model/user.model.js";

export const TicketRepository = {
  async create(ticketData: Partial<ITicket>) {
    return TicketModel.create(ticketData);
  },

  async findById(ticketId: string) {
    return TicketModel.findById(ticketId).populate("event");
  },

  async findByUser(userId: string) {
    return TicketModel.find({ owner: userId }).populate("event");
  },

  async update(ticketId: string, updateData: Partial<ITicket>) {
    return TicketModel.findByIdAndUpdate(ticketId, updateData, { new: true });
  },

  async findEventById(eventId: string) {
    return EventModel.findById(eventId);
  },

  async findUserById(userId: string) {
    return UserModel.findById(userId); 
}

};


