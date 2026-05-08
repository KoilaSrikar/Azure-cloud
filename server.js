const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
// Use the port Render assigns, or default to 3000 locally
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Database Configuration
// This will use the DATABASE_URL environment variable provided by Render/Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Required for external cloud databases like Railway
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Create table if it doesn't exist
async function initDB() {
  if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL not set. Database will not be initialized.");
    return;
  }
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      company VARCHAR(255),
      service VARCHAR(255) NOT NULL,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database table:", error);
  }
}

// Run database initialization on startup
initDB();

// POST endpoint to handle contact form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, company, service, message } = req.body;

  // Simple validation
  if (!name || !email || !service) {
    return res.status(400).json({ error: 'Please provide name, email, and service.' });
  }

  // If no database URL is set, simulate success (for local testing without DB)
  if (!process.env.DATABASE_URL) {
    console.log('No DB Configured. Received mock submission:', req.body);
    return res.status(201).json({ message: 'Contact saved successfully (Mock)!', contact: req.body });
  }

  try {
    // Insert into database
    const insertQuery = `
      INSERT INTO contacts (name, email, company, service, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [name, email, company || null, service, message || null];
    
    const result = await pool.query(insertQuery, values);
    const newContact = result.rows[0];

    console.log('New contact saved to database:', newContact.name);
    res.status(201).json({ message: 'Contact saved successfully!', contact: newContact });
  } catch (error) {
    console.error('Error saving contact to database:', error);
    res.status(500).json({ error: 'Failed to save contact information to the database.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
