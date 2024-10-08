import { Request, Response } from 'express';
import EventService from '../services/EventService';

class EventController {
  async createEvent(req: Request, res: Response) {
    try {
      const { title, description, date, totalSeats } = req.body;

      console.log(title);

      if (!title || !date || !totalSeats) {
        res.status(400).json({ message: 'Title, date, and totalSeats are required.' });
        return;
      }

      const createdById = req.user!.userId;

      const event = await EventService.createEvent(title, description, new Date(date), totalSeats, createdById);
      res.status(201).json({ message: 'Event created successfully.', event });
    } catch (error: any) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: error.message || 'Internal server error.' });
    }
  };

  /**
   * Retrieves all events.
   */
  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await EventService.getAllEvents();
      res.status(200).json({ events });
    } catch (error: any) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: error.message || 'Internal server error.' });
    }
  };

  /**
   * Retrieves an event by ID.
   */
  async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(Number(id));

      res.status(200).json({ event });
    } catch (error: any) {
      console.error('Error fetching event:', error);
      res.status(404).json({ message: error.message || 'Event not found.' });
    }
  }
}

export default new EventController();


