/*
  Warnings:

  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `maxParticipants` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `_ConfirmedEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WaitlistedEvents` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSeats` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CONFIRMED', 'WAITING', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "_ConfirmedEvents" DROP CONSTRAINT "_ConfirmedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConfirmedEvents" DROP CONSTRAINT "_ConfirmedEvents_B_fkey";

-- DropForeignKey
ALTER TABLE "_WaitlistedEvents" DROP CONSTRAINT "_WaitlistedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_WaitlistedEvents" DROP CONSTRAINT "_WaitlistedEvents_B_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "location",
DROP COLUMN "maxParticipants",
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "totalSeats" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "_ConfirmedEvents";

-- DropTable
DROP TABLE "_WaitlistedEvents";

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'CONFIRMED',
    "registrationTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Participant_status_registrationTime_idx" ON "Participant"("status", "registrationTime");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_userId_eventId_key" ON "Participant"("userId", "eventId");

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
