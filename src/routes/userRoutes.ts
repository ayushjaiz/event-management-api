import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

// User registration
router.post('/register', UserController.register);

// User login
router.post('/login', UserController.login);

// Get all users (for admin purposes)
// router.get('/', UserController);

// Get user by ID (for admin purposes)
// router.get('/:id', UserController.getUserById);

// Delete a user (for admin purposes)
// router.delete('/:id', UserController.deleteUser);

export default router;
