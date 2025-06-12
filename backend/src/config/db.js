// backend/src/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_DIALECT = 'postgres',
} = process.env;

// Instantiate Sequelize
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: false,       
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Connect & sync
export async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log('✔️  Database connection established successfully.');

    // For MVP: sync all models (use migrations in prod)
    await sequelize.sync({ alter: true });
    console.log('✔️  All models synchronized.');
  } catch (err) {
    console.error('❌  Unable to connect to the database:', err);
    process.exit(1);
  }
}
