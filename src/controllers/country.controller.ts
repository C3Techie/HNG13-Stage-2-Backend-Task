import { Request, Response } from 'express';
import { CountryService } from '../services/country.service';

export class CountryController {
  private countryService: CountryService;

  constructor() {
    this.countryService = new CountryService();
  }

  refreshCountries = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.countryService.refreshCountries();
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message.includes('Could not fetch data')) {
        res.status(503).json({
          error: 'External data source unavailable',
          details: error.message,
        });
      } else {
        res.status(500).json({
          error: 'Internal server error',
        });
      }
    }
  };

  getAllCountries = async (req: Request, res: Response): Promise<void> => {
    try {
      const { region, currency, sort } = req.query;

      const filters = {
        region: region as string | undefined,
        currency: currency as string | undefined,
        sort: sort as string | undefined,
      };

      const countries = await this.countryService.getAllCountries(filters);
      res.status(200).json(countries);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  };

  getCountryByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;

      if (!name) {
        res.status(400).json({
          error: 'Validation failed',
          details: {
            name: 'is required',
          },
        });
        return;
      }

      const country = await this.countryService.getCountryByName(name);

      if (!country) {
        res.status(404).json({
          error: 'Country not found',
        });
        return;
      }

      res.status(200).json(country);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  };

  deleteCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;

      if (!name) {
        res.status(400).json({
          error: 'Validation failed',
          details: {
            name: 'is required',
          },
        });
        return;
      }

      const deleted = await this.countryService.deleteCountry(name);

      if (!deleted) {
        res.status(404).json({
          error: 'Country not found',
        });
        return;
      }

      res.status(200).json({
        message: 'Country deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  };

  getStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const status = await this.countryService.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  };

  getImage = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!this.countryService.imageExists()) {
        res.status(404).json({
          error: 'Summary image not found',
        });
        return;
      }

      const imagePath = this.countryService.getImagePath();
      res.sendFile(imagePath);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  };
}
