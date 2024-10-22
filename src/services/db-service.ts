import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { Archive, Item } from '../models';

const archiveTable = 'Archive';
const itemTable = 'Item';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'archive-dev.db', location: 'default' });
};

export const createTable = async (db: SQLiteDatabase) => {
  await db.executeSql(`CREATE TABLE IF NOT EXISTS ${archiveTable}(
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
  );`)
  .then(() => {
    db.executeSql(`CREATE TABLE IF NOT EXISTS ${itemTable}(
      id TEXT PRIMARY KEY NOT NULL,
      aid TEXT NOT NULL,
      name TEXT NOT NULL
      FOREIGN KEY (aid)
        REFERENCES Archive (id)
    );`)
  })
  ;
};

export const getArchives = async (db: SQLiteDatabase): Promise<Archive[]> => {
  try {
    const archives: Archive[] = [];
    const results = await db.executeSql(`SELECT rowid as id,name FROM ${archiveTable}`);
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
    `INSERT OR REPLACE INTO ${archiveTable}(id, name) values` +
    archives.map(i => `('${i.id}', '${i.name}')`).join(',');

  return db.executeSql(insertQuery);
};

export const deleteArchive = async (db: SQLiteDatabase, id: string) => {
  const deleteQuery = `DELETE from ${archiveTable} where id = '${id}'`;
  await db.executeSql(deleteQuery);
};

export const getItems = async (db: SQLiteDatabase, aid: string): Promise<Item[]> => {
  try {
    const items: Item[] = [];
    const results = await db.executeSql(`SELECT rowid as id,name FROM ${itemTable} where aid = '${aid}'`);
    results.forEach((result: SQLiteDatabase) => { // idk about this type cast
      for (let index = 0; index < result.rows.length; index++) {
        items.push(result.rows.item(index))
      }
    });
    return items;
  } catch (error) {
    console.error(error);
    throw Error(`Error retrieving items from Archive (${aid}).`);
  }
};

export const saveItems = async (db: SQLiteDatabase, aid: string, items: Item[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${itemTable}(id, name, aid) values` +
    items.map(i => `('${i.id}', '${i.name}', '${aid}')`).join(',');

  return db.executeSql(insertQuery);
};

export const deleteItem = async (db: SQLiteDatabase, id: string) => {
  const deleteQuery = `DELETE from ${itemTable} where id = '${id}'`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table ${archiveTable}`;

  await db.executeSql(query);
};