import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = new URL(process.env.DATABASE_URL!);
const schema = databaseUrl.searchParams.get('schema') || 'public';

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
    schema: schema,
    entities: [`${__dirname}/../entities/**/*.ts`],
    migrations: [`${__dirname}/../migrations/**/*.ts`],
});
