import { knex } from 'knex';

export class Connection {
    mysql() {
        return knex({
            client: process.env.DB_TYPE || 'mysql',
            connection: {
                host: process.env.DB_HOST || 'localhost',
                port: +process.env.DB_PORT || 3306,
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || 'password',
                database: process.env.DB_DATABASE || 'dbname',
                charset: process.env.DB_CHARSET || 'utf8',
                timezone: process.env.DB_TIMEZONE || 'UTC'
            },
            pool: {
                min: 0,
                max: 7,
                afterCreate: (conn, done) => {
                    conn.query('SET NAMES utf8', (err) => {
                        done(err, conn);
                    });
                }
            },
            debug: false,
            acquireConnectionTimeout: 10000
        });
    }
}