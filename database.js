import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

export async function initializeDatabase() {
  const database = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });

  db = database;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      record_date TEXT NOT NULL,
      item_name TEXT NOT NULL,
      price INTEGER NOT NULL
    )
  `);

  console.log('Database table created successfully!');
  return database;
}

export async function getAllPrices() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  const stmt = await db.all('SELECT * FROM price_history ORDER BY record_date DESC');
  return stmt || [];
}

export async function addPriceRecord(recordDate, itemName, price) {
  if (!db) {
    throw new Error('Database not initialized');
  }
  await db.run(
    `INSERT INTO price_history (record_date, item_name, price) VALUES (?, ?, ?)`,
    [recordDate, itemName, price]
  );
}

export async function initTestData() {
  const testRecords = [
    {
      record_date: '2024-01-15',
      item_name: '大杯美式',
      price: 35
    },
    {
      record_date: '2024-06-20',
      item_name: '中杯拿鐵',
      price: 40
    },
    {
      record_date: '2024-12-01',
      item_name: '大杯美式',
      price: 38
    },
    {
      record_date: '2025-01-10',
      item_name: '燕麥奶拿鐵',
      price: 55
    }
  ];

  for (const record of testRecords) {
    await db.run(
      `INSERT OR IGNORE INTO price_history (record_date, item_name, price) VALUES (?, ?, ?)`,
      [record.record_date, record.item_name, record.price]
    );
  }

  console.log('Test data initialized successfully!');
}

export async function closeDatabase() {
  if (db) {
    await db.close();
  }
}
