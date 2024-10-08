// src/services/ParticipantService.ts

import { PrismaClient, Status } from '@prisma/client';
import EventService from './EventService';
import EmailService from '../utils/EmailService';

const prisma = new PrismaClient();

class ParticipantService {
  /**
   * Registers a participant for an event.
   * @returns The created participant
   */
  async registerParticipant(userId: number, eventId: number) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Check if the user is already registered for the event
        const existingParticipant = await tx.participant.findUnique({
          where: { userId_eventId: { userId, eventId } },
        });

        if (existingParticipant) {
          throw new Error('User is already registered for this event.');
        }

        // Fetch the event to check seat availability
        const event = await tx.event.findUnique({
          where: { id: eventId },
          include: { participants: true },
        });

        if (!event) {
          throw new Error('Event not found.');
        }

        // Count confirmed participants
        const confirmedCount = event.participants.filter(p => p.status === Status.CONFIRMED).length;

        let participant;

        if (confirmedCount < event.totalSeats) {
          // Seats available, confirm the participant
          participant = await tx.participant.create({
            data: {
              user: { connect: { id: userId } },
              event: { connect: { id: eventId } },
              status: Status.CONFIRMED,
            },
          });
        } else {
          // No seats available, add to waiting list
          participant = await tx.participant.create({
            data: {
              user: { connect: { id: userId } },
              event: { connect: { id: eventId } },
              status: Status.WAITING,
            },
          });
        }

        return participant;
      });

      // Send confirmation or waiting list email
      if (result.status === Status.CONFIRMED) {
        await EmailService.sendConfirmationEmail(userId, eventId);
      } else {
        await EmailService.sendWaitingListEmail(userId, eventId);
      }

      return result;
    } catch (error) {
      console.error('Error registering participant:', error);
      throw error;
    }
  }

  /**
   * Cancels a participant's registration.
   */
  async cancelRegistration(participantId: number) {
    try {
      const participant = await prisma.participant.findUnique({
        where: { id: participantId },
        include: { event: true },
      });

      if (!participant) {
        throw new Error('Participant not found.');
      }

      if (participant.status === Status.CANCELLED) {
        throw new Error('Participant is already cancelled.');
      }

      // Update status to CANCELLED
      await prisma.participant.update({
        where: { id: participantId },
        data: { status: Status.CANCELLED },
      });

      // Send cancellation email
      await EmailService.sendCancellationEmail(participant.userId, participant.eventId);

      if (participant.status === Status.CONFIRMED) {
        // Fetch the total confirmed participants and allowed seats for the event in a single query
        const [confirmedCount, event] = await Promise.all([
          prisma.participant.count({
            where: { eventId: participant.eventId, status: Status.CONFIRMED },
          }),
          EventService.getEventById(participant.eventId),
        ]);

        console.log(`Confirmed participants count for event ${participant.eventId}:`, confirmedCount);
        console.log('Total seats', event.totalSeats);

        // Check if there are available seats before looking for the next participant
        if (confirmedCount >= event.totalSeats) {
          const nextParticipant = await prisma.participant.findFirst({
            where: { eventId: participant.eventId, status: Status.WAITING },
            orderBy: { registrationTime: 'asc' },
          });

          if (nextParticipant) {
            await prisma.participant.update({
              where: { id: nextParticipant.id },
              data: { status: Status.CONFIRMED },
            });
            // Send promotion email
            await EmailService.sendPromotionEmail(nextParticipant.userId, nextParticipant.eventId);
          }
        }
      }

      return participant;
    } catch (error) {
      console.error('Error cancelling registration:', error);
      throw error;
    }
  }

  /**
   * Gets participant details from participant id
   */
  async getParticipantById(participantId: number) {
    return prisma.participant.findUnique({
      where: { id: participantId },
    });
  }

  /**
   * Gets all participant details by event id
   */
  async getAllParticipantsByEventId(eventId: number) {
    return prisma.participant.findMany({
      where: {
        eventId: eventId,
      },
    });
  }
}

export default new ParticipantService();
