import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { GoCardlessService } from '@/common/services/gocardless.service';
import { match, P } from 'ts-pattern';
import { parse } from 'date-fns';
import { DatabaseService } from '@/database/database.service';
import { AccountService } from '@/account/account.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly goCardlessService: GoCardlessService,
    private readonly databaseService: DatabaseService,
    private readonly accountService: AccountService,
  ) {}

  async listTransactions() {
    const accounts = await this.accountService.listAccounts();
    const transactions = await this.databaseService.transaction.findMany({
      where: {
        accountId: {
          in: accounts.map((account) => account.id),
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
}
