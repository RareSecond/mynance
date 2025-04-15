/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Requisition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_externalId_key" ON "Account"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Requisition_externalId_key" ON "Requisition"("externalId");
