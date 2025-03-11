import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

export interface Institution {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
  logo: string;
  max_access_valid_for_days: string;
}

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

  async listBanks(): Promise<Institution[]> {
    const request = await this.axiosInstance.get<Institution[]>(
      'https://bankaccountdata.gocardless.com/api/v2/institutions/?country=be',
    );

    return request.data;
  }
}
