// data-source.ts
import { DataSource } from "typeorm";
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mssql",
  host: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ["src/entity/*.ts"],
  /* entities: [__dirname + "/entity/*.ts"], */
  migrations: ["src/migration/*.ts"],
  synchronize: false, /* <- ATENÇÃO: recria/atualiza tabelas automaticamente; Útil apenas para testes e desenvolvimento rápido. 
  Perigoso em produção, porque pode apagar dados ou colunas sem aviso se você mudar a estrutura das entidades.*/
  options: {
    encrypt: false,
    enableArithAbort: true
  }
});
