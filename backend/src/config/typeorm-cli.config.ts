// Plik: backend/src/config/typeorm-cli.config.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Wczytaj zmienne środowiskowe z pliku .env znajdującego się w głównym folderze backendu
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Zakładamy, że .env jest w F:/PROJEKT SHOPPARTS/backend/

export const cliDataSourceOptions: DataSourceOptions = {
  type: 'mysql', // Spójne z database.module.ts (jeśli zostajesz przy MySQL)
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'dbcarsparts', // Używa nazwy bazy z backend/.env
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
  synchronize: false, // ZAWSZE false dla CLI
  logging: ['query', 'error'],
};

export default new DataSource(cliDataSourceOptions);
