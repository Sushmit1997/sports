import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env'
});

module.exports = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      stub: 'src/database/stubs/migration.stub',
      directory: 'src/database/migrations'
    }
  },

  production: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: 'src/database/migrations'
    }
  }
};
