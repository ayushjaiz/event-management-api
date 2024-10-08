// src/controllers/ParticipantController.ts

import { NextFunction, Request, Response } from 'express';
import ParticipantService from '../services/ParticipantService';
import { Role } from '@prisma/client';

export class ParticipantController {

  /**
   * Handles participant registration.
   */
  async registerParticipant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { eventId } = req.body;

      if (!req.user) {
        res.status(403).json({ message: 'Forbidden: Only authenticated users can register' });
        return;
      }

      const userId = req.user!.userId;

      // Perform registration logic...
      const result = await ParticipantService.registerParticipant(userId, Number(eventId));

      // Send the response, but don't return it
      res.status(201).json({ message: 'User registered', result });
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  }

  /**
   * Handles participant cancellation.
   */
  async cancelRegistration(req: Request, res: Response) {
    try {
      const { participantId } = req.params;
      if (!participantId) {
        res.status(400).json({ message: 'Participant ID is required.' });
        return;
      }

      if (!req.user) {
        res.status(403).json({ message: 'Forbidden: Only authenticated users can do cancellation' });
        return;
      }

      if (req.user!.role === Role.USER) {
        const userId = req.user!.userId;

        // Check if the participant exists and if it belongs to the requesting user
        const storedParticipant = await ParticipantService.getParticipantById(Number(participantId));

        console.log("Participant", participantId, storedParticipant);

        if (!storedParticipant || storedParticipant.userId !== userId) {
          res.status(404).json({ message: 'Participant not found or unauthorized.' });
          return;
        }
      }

      const participant = await ParticipantService.cancelRegistration(Number(participantId));
      res.status(200).json({ message: 'Registration cancelled successfully.', participant });
    } catch (error: any) {
      console.error('Error cancelling registration:', error);
      res.status(400).json({ message: error.message || 'Bad request.' });
    }
  };

  async listAllParticipantsByEventId(req: Request, res: Response) {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        res.status(400).json({ message: 'Event ID is required.' });
        return;
      }

      const participants = await ParticipantService.getAllParticipantsByEventId(Number(eventId));
      res.status(200).json({ confirmedParticipants: participants });
    } catch (error: any) {
      console.error('Error listing confirmed participants:', error);
      res.status(500).json({ message: error.message || 'Internal server error.' });
    }
  };
}


export default new ParticipantController();