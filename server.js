import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { initializeDatabase, initTestData, getAllPrices, addPriceRecord, deletePriceRecord } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database initialization
async function startServer() {
  try {
    await initializeDatabase();
    await initTestData();
    console.log('Database initialized with test data successfully!');
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    process.exit(1);
  }

  // API Routes
  app.get('/api/prices', async (req, res) => {
    try {
      const search = req.query.search || '';
      const prices = await getAllPrices(search);
      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/prices', async (req, res) => {
    try {
      const { record_date, item_name, price } = req.body;
      
      if (!record_date || !item_name || price === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await addPriceRecord(record_date, item_name, price);
      res.json({ message: 'Record added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/prices/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await deletePriceRecord(id);
      res.json({ message: 'Record deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Serve static files from public directory
  app.use(express.static('public'));

  // Serve index.html for root route
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}

startServer();