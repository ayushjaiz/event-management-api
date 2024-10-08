// src/services/UserService.ts

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Secret key for JWT (should be stored securely, e.g., in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

class UserService {
  /**
   * Registers a new user.
   * @param name - User's name
   * @param email - User's email
   * @param password - User's password
   * @param role - User's role (default: USER)
   * @returns The created user without the password
   */
  async register(name: string, email: string, password: string, role: Role = Role.USER) {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists with this email.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Exclude password from the returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Authenticates a user and returns a JWT.
   * @param email - User's email
   * @param password - User's password
   * @returns An object containing the JWT
   */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password.');
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    return { token };
  }

  /**
   * Retrieves a user by ID.
   * @param id - User's ID
   * @returns The user object without the password
   */
  async getUserById(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found.');
    }

    // Exclude password from the returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Updates a user's information.
   * @param id - User's ID
   * @param data - Data to update
   * @returns The updated user object without the password
   */
  async updateUser(id: number, data: Partial<{ name: string; email: string; password: string; role: Role }>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    // Exclude password from the returned user object
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Deletes a user by ID.
   * @param id - User's ID
   * @returns The deleted user object without the password
   */
  async deleteUser(id: number) {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    // Exclude password from the returned user object
    const { password: _, ...userWithoutPassword } = deletedUser;
    return userWithoutPassword;
  }
}

export default new UserService();
