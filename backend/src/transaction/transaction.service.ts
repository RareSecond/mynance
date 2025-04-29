import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { GoCardlessService } from '@/common/services/gocardless.service';
import { match, P } from 'ts-pattern';
import { parse } from 'date-fns';
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
    console.log(externalAccountId);
    const data =
      await this.goCardlessService.listTransactions(externalAccountId);
    const transactions = data.transactions.booked;
    await this.databaseService.transaction.deleteMany({
      where: {
        accountId,
      },
    });

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
    });
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

  async linkCategory(transactionId: string, categoryId: string) {
    const transaction = await this.get(transactionId);

    await this.databaseService.transactionCategory.deleteMany({
      where: {
        transactionId,
      },
    });

    await this.databaseService.transactionCategory.create({
      data: {
        transactionId,
        categoryId,
        amount: transaction.amount,
      },
    });
  }

  async getAnalytics(type: 'expenses' | 'income' | 'combined') {
    console.log(type);
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
    const categoriesWithAmount = await this.databaseService
      .$queryRaw(Prisma.sql`
    SELECT 
  c.name as name,
  SUM(tc.amount) as value
FROM 
  "TransactionCategory" tc
JOIN 
  "Category" c ON tc."categoryId" = c.id
JOIN 
  "Transaction" t ON tc."transactionId" = t.id
WHERE t."createdAt" >= date_trunc('month', current_date) AND ${where}
GROUP BY 
  c.name
ORDER BY 
  ${orderBy}
        `);
    return categoriesWithAmount;
  }
}
