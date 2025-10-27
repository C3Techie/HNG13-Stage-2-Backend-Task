import 'reflect-metadata';
import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import countryRoutes from './routes/country.routes';
import statusRoutes from './routes/status.routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (optional, for development)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Country Currency & Exchange API',
    version: '1.0.0',
    endpoints: {
      'POST /countries/refresh': 'Fetch and cache countries data',
      'GET /countries': 'Get all countries (supports filters: ?region=Africa&currency=NGN&sort=gdp_desc)',
      'GET /countries/:name': 'Get country by name',
      'DELETE /countries/:name': 'Delete country by name',
      'GET /status': 'Get API status',
      'GET /countries/image': 'Get summary image',
    },
  });
});

app.use('/countries', countryRoutes);
app.use('/status', statusRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
