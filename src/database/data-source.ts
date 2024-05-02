import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/roles.entity';

dotenv.config();

export const DataSourceTypeORM = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {rejectUnauthorized: false},
  synchronize: false,
  logging: false,
  entities: [User, Role],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
