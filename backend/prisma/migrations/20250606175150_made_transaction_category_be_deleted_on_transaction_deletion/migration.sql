-- DropForeignKey
ALTER TABLE "TransactionCategory" DROP CONSTRAINT "TransactionCategory_transactionId_fkey";

-- AddForeignKey
ALTER TABLE "TransactionCategory" ADD CONSTRAINT "TransactionCategory_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
