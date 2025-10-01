import { Request, Response, NextFunction } from "express";
import EventService from "../service/event.service.js";

export default class EventController {
    private eventService: EventService;

    constructor() {
        this.eventService = new EventService();
    }

    async createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { eventData, organizerId } = req.body; // destructure
            const mergedData = { ...eventData, organizerId }; // merge into single object
            console.log('mergedData', mergedData)
            const event = await this.eventService.createEvent(mergedData);
            res.status(201).json({ message: "Event created successfully", event });
        } catch (error: any) {
            console.error("Error in createEvent:", error);
            res.status(400).json({ message: error.message || "Failed to create event" });
        }
    }

    async getEventById(req: Request, res: Response): Promise<void> {
        try {
            const { eventId } = req.params;
            const event = await this.eventService.getEventById(eventId);
            if (!event) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
            res.status(200).json(event);
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Error fetching event" });
        }
    }

    async getAllEvents(req: Request, res: Response): Promise<void> {
        try {
            const events = await this.eventService.getAllEvents();
            res.status(200).json(events);
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Error fetching events" });
        }
    }
    
    async getMyEvents(req: Request, res: Response): Promise<void> {
        try {
            const organizerId = req.query.organizerId as string;
            const events = await this.eventService.getMyEvents(organizerId);
            res.status(200).json(events);
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Error fetching events" });
        }
    }


    async updateEvent(req: Request, res: Response): Promise<void> {
        try {
            const { eventId } = req.params;
            const updateData = req.body;
            const updatedEvent = await this.eventService.updateEvent(eventId, updateData);
            if (!updatedEvent) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
            res.status(200).json(updatedEvent);
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Error updating event" });
        }
    }

    async deleteEvent(req: Request, res: Response): Promise<void> {
        try {
            const { eventId } = req.params;
            const deletedEvent = await this.eventService.deleteEvent(eventId);
            if (!deletedEvent) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
            res.status(200).json({ message: "Event deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Error deleting event" });
        }
    }
}
