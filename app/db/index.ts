import pgPromise from 'pg-promise';

const initOptions = {
  // global event notification;
  error(error: Error, e: any) {
    if (e.cn) {
      // A connection-related error;
      //
      // Connections are reported back with the password hashed,
      // for safe errors logging, without exposing passwords.
      console.log('CN:', e.cn);
      console.log('EVENT:', error.message || error);
    }
  },
};

const pgp = pgPromise(initOptions);

const cn = {
  host: process.env.DOCKER_CONTAINER ? 'host.docker.internal' : 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres',
  max: 30, // use up to 30 connections
};

export const db = pgp(cn);
