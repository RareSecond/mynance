/*
  Warnings:

  - Made the column `externalId` on table `Requisition` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Requisition" ALTER COLUMN "externalId" SET NOT NULL;
