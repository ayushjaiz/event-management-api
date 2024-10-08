// src/routes/eventRoutes.ts

import { response, Router } from 'express';
import { Request, Response } from 'express';
import EventController from '../controllers/EventController';
import { authenticateToken, authorizeRoles } from '../middleware/AuthMiddleware';
import { Role } from '@prisma/client';

const router = Router();

// Creating a new event
router.post(
    '/',
    authenticateToken,
    authorizeRoles(Role.ADMIN),
    EventController.createEvent
);

// Retrieving all events
router.get('/', EventController.getAllEvents);

// Retrieving a single event by ID
router.get('/:id', EventController.getEventById);

export default router;
