// src/utils/EmailService.ts

import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class EmailService {
  private transporter;

  constructor() {
    // 1. create an email transporter.
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private async sendEmail({ email, subject, text, html }: { email: string, subject: string, text: string, html: string }): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_ADMIN,
      to: email,
      subject,
      text,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Unable to send email: ${error}`);
    }
  }

  private async getUserAndEvent(userId: number, eventId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!user || !event) {
      throw new Error('User or Event not found.');
    }

    return { user, event };
  }

  async sendConfirmationEmail(userId: number, eventId: number) {
    const { user, event } = await this.getUserAndEvent(userId, eventId);

    await this.sendEmail({
      email: user.email,
      subject: 'Event Confirmation',
      text: `Hello ${user.name},\n\nYou have been confirmed for the event "${event.title}" scheduled on ${event.date}.`,
      html: `<p>Hello ${user.name},</p><p>You have been <strong>confirmed</strong> for the event "<strong>${event.title}</strong>" scheduled on <strong>${event.date}</strong>.</p>`,
    });

    console.log(`Confirmation email sent to ${user.email}`);
  }

  async sendWaitingListEmail(userId: number, eventId: number) {
    const { user, event } = await this.getUserAndEvent(userId, eventId);

    await this.sendEmail({
      email: user.email,
      subject: 'Added to Waiting List',
      text: `Hello ${user.name},\n\nYou have been added to the waiting list for the event "${event.title}" scheduled on ${event.date}.`,
      html: `<p>Hello ${user.name},</p><p>You have been added to the <strong>waiting list</strong> for the event "<strong>${event.title}</strong>" scheduled on <strong>${event.date}</strong>.</p>`,
    });

    console.log(`Waiting list email sent to ${user.email}`);
  }

  async sendPromotionEmail(userId: number, eventId: number) {
    const { user, event } = await this.getUserAndEvent(userId, eventId);

    await this.sendEmail({
      email: user.email,
      subject: 'Promotion to Confirmed Participant',
      text: `Hello ${user.name},\n\nGood news! You've been moved from the waiting list to confirmed for the event "${event.title}" scheduled on ${event.date}.`,
      html: `<p>Hello ${user.name},</p><p>Good news! You've been moved from the <strong>waiting list</strong> to <strong>confirmed</strong> for the event "<strong>${event.title}</strong>" scheduled on <strong>${event.date}</strong>.</p>`,
    });

    console.log(`Promotion email sent to ${user.email}`);
  }

  async sendCancellationEmail(userId: number, eventId: number) {
    const { user, event } = await this.getUserAndEvent(userId, eventId);

    await this.sendEmail({
      email: user.email,
      subject: 'Registration Cancelled',
      text: `Hello ${user.name},\n\nYour registration for the event "${event.title}" scheduled on ${event.date} has been cancelled.`,
      html: `<p>Hello ${user.name},</p><p>Your registration for the event "<strong>${event.title}</strong>" scheduled on <strong>${event.date}</strong> has been <strong>cancelled</strong>.</p>`,
    });

    console.log(`Cancellation email sent to ${user.email}`);
  }
}

export default new EmailService();
