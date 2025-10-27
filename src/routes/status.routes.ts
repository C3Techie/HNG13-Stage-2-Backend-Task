import { Router } from 'express';
import { CountryController } from '../controllers/country.controller';

const router = Router();
const countryController = new CountryController();

// GET /status - Get status (total countries and last refresh timestamp)
router.get('/', countryController.getStatus);

export default router;
