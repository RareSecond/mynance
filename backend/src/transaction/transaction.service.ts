import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { GoCardlessService } from '@/common/services/gocardless.service';
import { match, P } from 'ts-pattern';
import { addMonths, parse } from 'date-fns';
import { DatabaseService } from '@/database/database.service';
import { AccountService } from '@/account/account.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    private readonly goCardlessService: GoCardlessService,
    private readonly databaseService: DatabaseService,
    private readonly accountService: AccountService,
  ) {}

  async listTransactions(uncategorizedOnly: boolean) {
    const accounts = await this.accountService.listAccounts();
    const transactions = await this.databaseService.transaction.findMany({
      where: {
        accountId: {
          in: accounts.map((account) => account.id),
        },
        ...(uncategorizedOnly
          ? {
              categories: {
                none: {},
              },
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
      select: {
        id: true,
        amount: true,
        currency: true,
        description: true,
        counterPartyName: true,
        createdAt: true,
        note: true,
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return transactions;
  }

  async get(transactionId: string) {
    const transaction = await this.databaseService.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });

    return transaction;
  }

  async importTransactions(accountId: string) {
    const externalAccountId =
      await this.accountService.getExternalAccountId(accountId);
    const { lastFetchedAt } = await this.accountService.findAccountWithFields(
      accountId,
      {
        lastFetchedAt: true,
      },
    );
    const data = await this.goCardlessService.listTransactions(
      externalAccountId,
      lastFetchedAt,
    );
    const transactions = data.transactions.booked;

    await this.databaseService.transaction.createMany({
      data: transactions.map((transaction) => {
        const amount = parseFloat(transaction.transactionAmount.amount);

        const counterPartyName = match(amount)
          .with(P.number.gt(0), () => transaction.debtorName || 'Unknown')
          .with(
            P.number.lt(0),
            () =>
              transaction.creditorName ||
              this.getCounterPartyNameFromRemittanceInformation(
                transaction.remittanceInformationUnstructured,
              ),
          )
          .with(0, () => 'Unknown')
          .otherwise(() => {
            throw new UnprocessableEntityException(
              `Could not determine counter party name for transaction ${transaction.transactionId} and amount ${amount}`,
            );
          });

        return {
          accountId,
          externalId: transaction.transactionId,
          amount,
          currency: transaction.transactionAmount.currency,
          description:
            transaction.remittanceInformationUnstructured ||
            transaction.remittanceInformationStructured,
          counterPartyName,
          createdAt: this.extractDateFromId(transaction.transactionId),
        };
      }),
      skipDuplicates: true,
    });

    await this.accountService.updateLastFetchedAt(accountId);
  }

  private extractDateFromId(id: string) {
    const regex = /^(.+)(?=\.\d+$)/;
    const match = id.match(regex);
    if (!match) {
      throw new Error(`Could not extract date from transaction ID: ${id}`);
    }
    const dateString = match[1];

    const date = parse(dateString, 'yyyy-MM-dd-HH.mm.ss', new Date());

    return date;
  }

  private getCounterPartyNameFromRemittanceInformation(
    remittanceInformation: string,
  ) {
    const regex =
      /^(.*?)(?:Domiciliëring|Betaling|Instantoverschrijving|Overschrijving)/;
    const match = remittanceInformation.match(regex);

    if (match) {
      return match[1].trim();
    }

    return 'Unknown';
  }

  async updateTransaction(
    transactionId: string,
    updateDto: { note?: string; categoryId?: string },
  ) {
    await this.databaseService.$transaction(async (tx) => {
      if (updateDto.categoryId) {
        // Delete existing categories
        await tx.transactionCategory.deleteMany({
          where: {
            transactionId,
          },
        });

        // Create new category link
        await tx.transactionCategory.create({
          data: {
            transactionId,
            categoryId: updateDto.categoryId,
            amount: (
              await tx.transaction.findUnique({
                where: { id: transactionId },
                select: { amount: true },
              })
            ).amount,
          },
        });
      }

      if (updateDto.note !== undefined) {
        await tx.transaction.update({
          where: { id: transactionId },
          data: { note: updateDto.note },
        });
      }
    });
  }

  async getAnalytics(
    type: 'expenses' | 'income' | 'combined',
    startDate: Date,
  ) {
    const endDate = addMonths(startDate, 1);
    const where = match(type)
      .with('expenses', () => Prisma.sql`t."amount" < 0`)
      .with('income', () => Prisma.sql`t."amount" > 0`)
      .with('combined', () => Prisma.sql`true`)
      .exhaustive();
    const orderBy = match(type)
      .with('expenses', () => Prisma.sql`value ASC`)
      .with('income', () => Prisma.sql`value DESC`)
      .with('combined', () => Prisma.sql`value DESC`)
      .exhaustive();
    const categoriesWithAmount = await this.databaseService.$queryRaw<
      { name: string; value: number }[]
    >(Prisma.sql`
    SELECT 
  c.name as name,
  SUM(tc.amount) as value
FROM 
  "TransactionCategory" tc
JOIN 
  "Category" c ON tc."categoryId" = c.id
JOIN 
  "Transaction" t ON tc."transactionId" = t.id
WHERE t."createdAt" >= ${startDate} AND t."createdAt" < ${endDate} AND ${where}
GROUP BY 
  c.name
ORDER BY 
  ${orderBy}
        `);
    return categoriesWithAmount;
  }
}
