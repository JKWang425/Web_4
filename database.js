import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';

let db;

export async function initializeDatabase() {
  const isAzure = !!process.env.WEBSITE_SITE_NAME;
  const dataDir = isAzure ? '/home/data' : '.';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const database = await open({
    filename: path.join(dataDir, 'database.db'),
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

export async function getAllPrices(keyword = '') {
  if (!db) {
    throw new Error('Database not initialized');
  }
  if (keyword) {
    return await db.all(
      'SELECT * FROM price_history WHERE item_name LIKE ? OR record_date LIKE ? ORDER BY record_date DESC',
      [`%${keyword}%`, `%${keyword}%`]
    ) || [];
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

export async function deletePriceRecord(id) {
  if (!db) {
    throw new Error('Database not initialized');
  }
  await db.run('DELETE FROM price_history WHERE id = ?', [id]);
}

export async function initTestData() {
  const testRecords = [
    {
      record_date: '2024-01-15',
      item_name: '特選美式咖啡大杯',
      price: 55
    },
    {
      record_date: '2024-06-20',
      item_name: '特選拿鐵大杯',
      price: 65
    },
    {
      record_date: '2024-12-01',
      item_name: '精品美式中杯',
      price: 80
    },
    {
      record_date: '2025-01-10',
      item_name: '精品拿鐵大杯',
      price: 110
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
