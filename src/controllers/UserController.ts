// src/controllers/UserController.ts

import { Request, Response } from 'express';
import UserService from '../services/UserService';

export class UserController {

  /**
   * Handles user registration.
   */
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ message: 'Name, email, and password are required.' });
        return;
      }

      const user = await UserService.register(name, email, password, role);
      res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error: any) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: error.message || 'Internal server error.' });
    }
  };

  /**
   * Handles user login.
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
         res.status(400).json({ message: 'Email and password are required.' });
         return;
      }

      const { token } = await UserService.login(email, password);
      res.status(200).json({ message: 'Login successful.', token });
    } catch (error: any) {
      console.error('Error logging in:', error);
      res.status(401).json({ message: error.message || 'Authentication failed.' });
    }
  };

  /**
   * Retrieves a user by ID.
   */
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(Number(id));

      res.status(200).json({ user });
    } catch (error: any) {
      console.error('Error fetching user:', error);
      res.status(404).json({ message: error.message || 'User not found.' });
    }
  };

  /**
   * Updates a user's information.
   */
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const updatedUser = await UserService.updateUser(Number(id), data);
      res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
    } catch (error: any) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: error.message || 'Internal server error.' });
    }
  };

  /**
   * Deletes a user by ID.
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedUser = await UserService.deleteUser(Number(id));

      res.status(200).json({ message: 'User deleted successfully.', user: deletedUser });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: error.message || 'Internal server error.' });
    }
  };
}

export default new UserController();
