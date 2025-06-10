import { DataSource } from 'typeorm';
import { Prompt } from '../entities/Prompt';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_DATABASE || 'prompt_hub',
  synchronize: true, // Be careful with this in production
  logging: false,
  entities: [Prompt],
  subscribers: [],
  migrations: [],
});

// Initialize the database connection
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}; 