import EventRepository from "../repositories/event.repository.js";
import { IEvent } from "../model/interfaces/modal.interfaces.js";

export default class EventService {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
    console.log('entered event service')
    return await this.eventRepository.createEvent(eventData);
  }

  async getEventById(eventId: string): Promise<IEvent | null> {
    return await this.eventRepository.findById(eventId);
  }

  async getAllEvents(): Promise<IEvent[]> {
    return await this.eventRepository.findAll();
  }
  async getMyEvents(organizerId: string): Promise<IEvent[] | null> {
    return await this.eventRepository.findMyEvents(organizerId);
  }
  async updateEvent(eventId: string, updateData: Partial<IEvent>): Promise<IEvent | null> {
    return await this.eventRepository.updateEvent(eventId, updateData);
  }

  async deleteEvent(eventId: string): Promise<IEvent | null> {
    return await this.eventRepository.deleteEvent(eventId);
  }
}
