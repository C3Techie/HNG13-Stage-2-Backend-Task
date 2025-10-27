import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Country } from '../models/Country';

dotenv.config();

// Parse JAWSDB_URL for Heroku or use individual env vars for local
const getDbConfig = () => {
  const jawsDbUrl = process.env.JAWSDB_URL;
  
  if (jawsDbUrl) {
    // Parse Heroku JawsDB connection URL
    const url = new URL(jawsDbUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port || '3306'),
      username: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''),
    };
  }
  
  // Fallback to local environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'countries_db',
  };
};

const dbConfig = getDbConfig();

export const AppDataSource = new DataSource({
  type: 'mysql',
  ...dbConfig,
  synchronize: true,
  logging: false,
  entities: [Country],
  subscribers: [],
  migrations: [],
});
