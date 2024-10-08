import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class EventService {
  /**
   * Creates a new event.
   * @returns The created event
   */
  async createEvent(title: string, description: string, date: Date, totalSeats: number, createdById: number) {

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date,
        totalSeats,
        createdBy: { connect: { id: createdById } },
      },
    });

    return event;
  }

  /**
   * Retrieves all events.
   * @returns A list of events
   */
  async getAllEvents() {
    const events = await prisma.event.findMany({
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        participants: true,
      },
      orderBy: { date: 'asc' },
    });

    return events;
  }

  /**
   * Retrieves an event by ID.
   * @param id - Event's ID
   * @returns The event object
   */
  async getEventById(id: number) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        participants: true,
      },
    });

    if (!event) {
      throw new Error('Event not found.');
    }

    return event;
  }
}

export default new EventService();

