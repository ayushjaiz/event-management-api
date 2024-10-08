-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "maxParticipants" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConfirmedEvents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_WaitlistedEvents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConfirmedEvents_AB_unique" ON "_ConfirmedEvents"("A", "B");

-- CreateIndex
CREATE INDEX "_ConfirmedEvents_B_index" ON "_ConfirmedEvents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WaitlistedEvents_AB_unique" ON "_WaitlistedEvents"("A", "B");

-- CreateIndex
CREATE INDEX "_WaitlistedEvents_B_index" ON "_WaitlistedEvents"("B");

-- AddForeignKey
ALTER TABLE "_ConfirmedEvents" ADD CONSTRAINT "_ConfirmedEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConfirmedEvents" ADD CONSTRAINT "_ConfirmedEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WaitlistedEvents" ADD CONSTRAINT "_WaitlistedEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WaitlistedEvents" ADD CONSTRAINT "_WaitlistedEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
