import { Router } from 'express';
import { CountryController } from '../controllers/country.controller';

const router = Router();
const countryController = new CountryController();

// POST /countries/refresh - Refresh countries data from external APIs
router.post('/refresh', countryController.refreshCountries);

// GET /countries - Get all countries with optional filters and sorting
router.get('/', countryController.getAllCountries);

// GET /countries/image - Get summary image
router.get('/image', countryController.getImage);

// GET /countries/:name - Get country by name
router.get('/:name', countryController.getCountryByName);

// DELETE /countries/:name - Delete country by name
router.delete('/:name', countryController.deleteCountry);

export default router;
