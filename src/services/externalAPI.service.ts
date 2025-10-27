import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

interface CountryAPIResponse {
  name: string;
  capital?: string;
  region?: string;
  population: number;
  flag?: string;
  currencies?: Array<{
    code: string;
    name: string;
    symbol: string;
  }>;
}

interface ExchangeRateAPIResponse {
  result: string;
  time_last_update_utc: string;
  rates: {
    [key: string]: number;
  };
}

export class ExternalAPIService {
  private countriesApiUrl: string;
  private exchangeRateApiUrl: string;

  constructor() {
    this.countriesApiUrl = process.env.COUNTRIES_API_URL || 'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies';
    this.exchangeRateApiUrl = process.env.EXCHANGE_RATE_API_URL || 'https://open.er-api.com/v6/latest/USD';
  }

  async fetchCountries(): Promise<CountryAPIResponse[]> {
    try {
      const response = await axios.get<CountryAPIResponse[]>(this.countriesApiUrl, {
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Could not fetch data from RestCountries API: ${error.message}`);
    }
  }

  async fetchExchangeRates(): Promise<{ [key: string]: number }> {
    try {
      const response = await axios.get<ExchangeRateAPIResponse>(this.exchangeRateApiUrl, {
        timeout: 10000,
      });
      return response.data.rates;
    } catch (error: any) {
      throw new Error(`Could not fetch data from Exchange Rate API: ${error.message}`);
    }
  }
}
