import express from 'express';
import ParticipantController from '../controllers/ParticipantController';
import { Role } from '@prisma/client';
import { authenticateToken, authorizeRoles } from '../middleware/AuthMiddleware';

const router = express.Router();

router.post(
  '/register',
  authenticateToken,
  authorizeRoles(Role.USER, Role.ADMIN),
  ParticipantController.registerParticipant
);

router.post(
  '/cancel/:participantId',
  authenticateToken,
  authorizeRoles(Role.USER, Role.ADMIN),
  ParticipantController.cancelRegistration
);

router.get(
  '/event/:eventId',
  authenticateToken,
  ParticipantController.listAllParticipantsByEventId
);

export default router;
