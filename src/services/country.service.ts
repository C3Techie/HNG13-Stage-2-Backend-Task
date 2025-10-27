import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Country } from '../models/Country';
import { ExternalAPIService } from './externalAPI.service';
import { ImageGeneratorService } from './imageGenerator.service';

export class CountryService {
  private countryRepository: Repository<Country>;
  private externalAPIService: ExternalAPIService;
  private imageGeneratorService: ImageGeneratorService;

  constructor() {
    this.countryRepository = AppDataSource.getRepository(Country);
    this.externalAPIService = new ExternalAPIService();
    this.imageGeneratorService = new ImageGeneratorService();
  }

  async refreshCountries(): Promise<{ message: string; count: number }> {
    try {
      // Fetch data from external APIs
      const countries = await this.externalAPIService.fetchCountries();
      const exchangeRates = await this.externalAPIService.fetchExchangeRates();

      const now = new Date();
      let processedCount = 0;

      // Process each country
      for (const countryData of countries) {
        let currencyCode: string | null = null;
        let exchangeRate: number | null = null;
        let estimatedGdp: number | null = null;

        // Extract currency code (first currency only)
        if (countryData.currencies && countryData.currencies.length > 0) {
          currencyCode = countryData.currencies[0].code;

          // Get exchange rate
          if (currencyCode && exchangeRates[currencyCode]) {
            exchangeRate = exchangeRates[currencyCode];

            // Calculate estimated GDP
            const randomMultiplier = Math.random() * (2000 - 1000) + 1000;
            estimatedGdp = (countryData.population * randomMultiplier) / exchangeRate;
          }
        }

        // Handle countries with no currency
        if (!currencyCode) {
          estimatedGdp = 0;
        }

        // Check if country exists (case-insensitive)
        const existingCountry = await this.countryRepository
          .createQueryBuilder('country')
          .where('LOWER(country.name) = LOWER(:name)', { name: countryData.name })
          .getOne();

        if (existingCountry) {
          // Update existing country
          existingCountry.capital = countryData.capital || null;
          existingCountry.region = countryData.region || null;
          existingCountry.population = countryData.population;
          existingCountry.currency_code = currencyCode;
          existingCountry.exchange_rate = exchangeRate;
          existingCountry.estimated_gdp = estimatedGdp;
          existingCountry.flag_url = countryData.flag || null;
          existingCountry.last_refreshed_at = now;

          await this.countryRepository.save(existingCountry);
        } else {
          // Insert new country
          const newCountry = this.countryRepository.create({
            name: countryData.name,
            capital: countryData.capital || null,
            region: countryData.region || null,
            population: countryData.population,
            currency_code: currencyCode,
            exchange_rate: exchangeRate,
            estimated_gdp: estimatedGdp,
            flag_url: countryData.flag || null,
            last_refreshed_at: now,
          });

          await this.countryRepository.save(newCountry);
        }

        processedCount++;
      }

      // Generate summary image
      const topCountries = await this.countryRepository.find({
        where: {},
        order: { estimated_gdp: 'DESC' },
        take: 5,
      });

      const topCountriesData = topCountries
        .filter(c => c.estimated_gdp !== null)
        .map(c => ({
          name: c.name,
          estimated_gdp: Number(c.estimated_gdp),
        }));

      await this.imageGeneratorService.generateSummaryImage(
        processedCount,
        topCountriesData,
        now
      );

      return {
        message: 'Countries data refreshed successfully',
        count: processedCount,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async getAllCountries(filters: {
    region?: string;
    currency?: string;
    sort?: string;
  }): Promise<Country[]> {
    const queryBuilder = this.countryRepository.createQueryBuilder('countries');

    // Apply filters
    if (filters.region) {
      queryBuilder.andWhere('countries.region = :region', { region: filters.region });
    }

    if (filters.currency) {
      queryBuilder.andWhere('countries.currency_code = :currency', { currency: filters.currency });
    }

    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'gdp_desc':
          queryBuilder.orderBy('countries.estimated_gdp', 'DESC');
          break;
        case 'gdp_asc':
          queryBuilder.orderBy('countries.estimated_gdp', 'ASC');
          break;
        case 'name_asc':
          queryBuilder.orderBy('countries.name', 'ASC');
          break;
        case 'name_desc':
          queryBuilder.orderBy('countries.name', 'DESC');
          break;
        case 'population_desc':
          queryBuilder.orderBy('countries.population', 'DESC');
          break;
        case 'population_asc':
          queryBuilder.orderBy('countries.population', 'ASC');
          break;
        default:
          queryBuilder.orderBy('countries.id', 'ASC');
      }
    } else {
      queryBuilder.orderBy('countries.id', 'ASC');
    }

    return await queryBuilder.getMany();
  }

  async getCountryByName(name: string): Promise<Country | null> {
    const country = await this.countryRepository
      .createQueryBuilder('country')
      .where('LOWER(country.name) = LOWER(:name)', { name })
      .getOne();

    return country;
  }

  async deleteCountry(name: string): Promise<boolean> {
    const country = await this.getCountryByName(name);
    
    if (!country) {
      return false;
    }

    await this.countryRepository.remove(country);
    return true;
  }

  async getStatus(): Promise<{ total_countries: number; last_refreshed_at: string | null }> {
    const totalCountries = await this.countryRepository.count();
    
    const lastRefreshed = await this.countryRepository
      .createQueryBuilder('country')
      .select('MAX(country.last_refreshed_at)', 'last_refreshed')
      .getRawOne();

    return {
      total_countries: totalCountries,
      last_refreshed_at: lastRefreshed?.last_refreshed || null,
    };
  }

  getImagePath(): string {
    return this.imageGeneratorService.getImagePath();
  }

  imageExists(): boolean {
    return this.imageGeneratorService.imageExists();
  }
}
