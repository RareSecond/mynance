import { GetBanksResponse } from '@mynance/types';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoCardlessService {
  private accessToken: string;
  private axiosInstance = axios.create();

  constructor() {
    const fetchAccessToken = async () => {
      const request = await axios.post<{
        access: string;
        access_expires: number;
        refresh: string;
        refresh_expires: number;
      }>('https://bankaccountdata.gocardless.com/api/v2/token/new/', {
        secret_id: process.env.GOCARDLESS_SECRET_ID,
        secret_key: process.env.GOCARDLESS_SECRET_KEY,
      });
      this.accessToken = request.data.access;

      // Set default authorization header for all requests
      this.axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${this.accessToken}`;
    };

    fetchAccessToken();
  }

  async listBanks(): Promise<GetBanksResponse[]> {
    const res = await this.axiosInstance.get<GetBanksResponse[]>(
      'https://bankaccountdata.gocardless.com/api/v2/institutions/?country=be',
    );

    return res.data;
  }

  async createEndUserAgreement(institutionId: string) {
    const res = await this.axiosInstance.post(
      'https://bankaccountdata.gocardless.com/api/v2/agreements/enduser/',
      {
        institution_id: institutionId,
        max_historical_days: 365,
      },
    );

    return res.data;
  }

  async createLink(bankId: string, agreementId: string) {
    const res = await this.axiosInstance.post<{ link: string; id: string }>(
      'https://bankaccountdata.gocardless.com/api/v2/requisitions/',
      {
        institution_id: bankId,
        agreement: agreementId,
        redirect: `${process.env.FRONTEND_URL}/settings/accounts/requisition/callback`,
      },
    );

    return res.data;
  }

  async listAccounts(externalRequisitionId: string) {
    const res = await this.axiosInstance.get<{
      id: string;
      status: string;
      agreements: string;
      reference: string;
      accounts: string[];
    }>(
      `https://bankaccountdata.gocardless.com/api/v2/requisitions/${externalRequisitionId}`,
    );

    return res.data;
  }

  async getAccount(externalAccountId: string) {
    const res = await this.axiosInstance.get<{
      id: string;
      created: string;
      last_accessed: string;
      iban: string;
      bban: string;
      status: string;
      institution_id: string;
      owner_name: string;
      name: string;
    }>(
      `https://bankaccountdata.gocardless.com/api/v2/accounts/${externalAccountId}`,
    );

    return res.data;
  }

  async listTransactions(externalAccountId: string) {
    try {
      const res = await this.axiosInstance.get<{
        id: string;
        status: string;
        agreements: string;
        reference: string;
        transactions: {
          booked: any[];
        };
      }>(
        `https://bankaccountdata.gocardless.com/api/v2/accounts/${externalAccountId}/transactions/`,
      );
      return res.data;
    } catch (error) {
      console.error('Error fetching transactions', error);
      throw error;
    }
  }
}
