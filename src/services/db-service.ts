import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { Archive } from '../models';

const tableName = 'Archive';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'archive-dev.db', location: 'default' });
};

export const createTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL
    );`;

  await db.executeSql(query);
};

export const getArchives = async (db: SQLiteDatabase): Promise<Archive[]> => {
  try {
    const archives: Archive[] = [];
    const results = await db.executeSql(`SELECT rowid as id,name FROM ${tableName}`);
    results.forEach((result: SQLiteDatabase) => { // idk about this type cast
      for (let index = 0; index < result.rows.length; index++) {
        archives.push(result.rows.item(index))
      }
    });
    return archives;
  } catch (error) {
    console.error(error);
    throw Error('Error retrieving archives.');
  }
};

export const saveArchives = async (db: SQLiteDatabase, archives: Archive[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(id, name) values` +
    archives.map(i => `('${i.id}', '${i.name}')`).join(',');

  return db.executeSql(insertQuery);
};

export const deleteArchive = async (db: SQLiteDatabase, id: string) => {
  const deleteQuery = `DELETE from ${tableName} where id = '${id}'`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};