import { config } from 'dotenv';
import path from 'node:path';

const NODE_ENV = process.env.NODE_ENV;
const pathEnv =
  NODE_ENV === 'development'
    ? path.resolve('src/Config/.env.development')
    : path.resolve('src/Config/.env.production');
console.log({ path: pathEnv });
config({ path: pathEnv });
