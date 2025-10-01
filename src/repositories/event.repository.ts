import { EventModel } from "../model/event.model.js";
import { IEvent } from "../model/interfaces/modal.interfaces.js";

export default class EventRepository {
  async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
    console.log('entered create event repo')
    const newEvent = new EventModel(eventData);
    let data =  await newEvent.save();
    console.log('saved data', data)
    return data
  }

  async findById(eventId: string): Promise<IEvent | null> {
    return await EventModel.findById(eventId).populate("organizerId")
  }

  async findAll(): Promise<IEvent[]> {
    return await EventModel.find().populate("organizerId")
  }
  async findMyEvents(organizerId: string): Promise<IEvent[] | null> {
     return await EventModel.find({ organizerId })
        .populate("organizerId", "name email") 
        .exec();
  }
  
  async updateEvent(eventId: string, updateData: Partial<IEvent>): Promise<IEvent | null> {
    return await EventModel.findByIdAndUpdate(eventId, updateData, { new: true }).exec();
  }

  async deleteEvent(eventId: string): Promise<IEvent | null> {
    return await EventModel.findByIdAndDelete(eventId).exec();
  }
}
