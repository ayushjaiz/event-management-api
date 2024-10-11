import prisma from "../config/db";

class EventService {
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

