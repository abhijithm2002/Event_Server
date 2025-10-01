import { Types } from "mongoose";

// models/interfaces.ts
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'attendee' | 'organizer' | 'admin';
  createdAt?: Date;
}

export interface IEvent {
  _id?: string;
  organizerId: Types.ObjectId | string;
  title: string;
  description?: string;
  venue?: string;
  address?: string;
  startAt: Date;
  endAt?: Date;
  images?: string;
  capacity: number;
  status: 'draft' | 'published' | 'cancelled';
  createdAt?: Date;
  price: Number,     
  currency: string,   
  quantity: number,   
  sold: number,  
  salesStart: Date,
  salesEnd: Date,
}



export interface ITicket {
  _id?: Types.ObjectId | string;
  event: Types.ObjectId | IEvent | string;   // allow populate
  owner: Types.ObjectId | IUser | string; 
  orderId: string;
  code: string; // unique ticket code
  qrData?: string;
  pdfUrl?: string;
  status: 'active' | 'used' | 'cancelled' | 'refunded';
  createdAt?: Date;
}
