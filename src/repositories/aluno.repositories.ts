import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

export const dbConfig: sql.config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

export async function connectAlunos() {
  try {
    return await sql.connect(dbConfig);
  } catch (err) {
    console.error('Erro ao conectar:', err);
    throw err;
  }
}


