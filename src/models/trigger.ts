import { Knex } from 'knex';

export class Trigger {

    getData(db: Knex, sql: string) {
        sql = sql.trim();
        let select = sql.substring(0, 6);
        select = select.toUpperCase();
        return db.raw((select === 'SELECT') ? sql : 'SELECT 1');
    }

}