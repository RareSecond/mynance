/*
  Warnings:

  - Added the required column `accountId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN "accountId" TEXT;

-- Update existing categories to link to an account of their user
UPDATE "Category" c
SET "accountId" = (
  SELECT a.id 
  FROM "Account" a
  JOIN "_AccountToUser" au ON au."A" = a.id
  WHERE au."B" = c."userId"
  LIMIT 1
);

-- Make accountId required after data migration
ALTER TABLE "Category" ALTER COLUMN "accountId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
