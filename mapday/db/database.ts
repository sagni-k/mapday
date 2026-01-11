import * as SQLite from 'expo-sqlite';
let db: SQLite.SQLiteDatabase | null = null;

export async function connect_db() {
    if(db) return db;
    db = await SQLite.openDatabaseAsync('mapday_db');
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS TimedTaskTable(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskName TEXT NOT NULL,
        startMinutes INTEGER NOT NULL,
        endMinutes INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS UnTimedTaskTable(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskName TEXT NOT NULL
        );
    `);

    return db;
}