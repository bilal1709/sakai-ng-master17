// server.js

const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware setup
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(bodyParser.json());
app.use(session({
  secret: 'mysecret', // Change this to a secure random string in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure:true in production if using HTTPS
}));

// SQLite3 setup
const db = new sqlite3.Database('./AMS.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    createTable();
  }
});

// Create users table if not exists
function createTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `;
  db.run(sql, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Users table created or already exists.');
    }
  });
}

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //cb(null, 'uploads/');
    cb(null, '../src/assets/demo/uploads/')
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

app.post('/api/users/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Save file name in database
  const fileName = req.file.filename;
  db.run("UPDATE users SET (ProfilePic) = (?) WHERE USERID =1", [fileName], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ filePath: `uploads/${fileName}` });
  });
});

// Route to get the user's profile picture
app.get('/api/users/profile-picture', (req, res) => {
  db.get("SELECT ProfilePic FROM users WHERE USERID = 1", (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row && row.ProfilePic) {
      console.log("File: " + row.ProfilePic);
      res.status(200).json({ filePath: `uploads/${row.ProfilePic}` });
    } else {
      res.status(404).json({ message: 'No profile picture found' });
    }
  });
});
// Routes

// Get Configuration
app.get('/api/configuration', (req, res) => {
  const sql = 'SELECT * FROM configuration';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching configuration:', err.message);
      res.status(500).json({ error: 'Failed to fetch configuration' });
    } else {
      res.json(rows);
    }
  });
});
app.get('/api/config/get', (req, res) => {
  db.get("SELECT * FROM configuration", (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(row || { menuMode: 'static', ripple: false, inputStyle: 'Outlined', scale: 14, theme: 'lara-light-indigo', colorScheme: 'light' });
  });
});

// Save menu mode
app.post('/api/config/save/:colName', (req, res) => {
  const { colName } = req.params;
  const { ColValue } = req.body;
  console.log("ripple Value: " + ColValue);
  
  // Convert boolean values to 0/1 for storage
  const valueToStore = ColValue === 'true' ? 1 : 0;
  // Properly sanitize inputs to prevent SQL injection
  const sql = `UPDATE CONFIGURATION SET ${colName} = ?`;

  db.run(sql, [ColValue], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Update successful', affectedRows: this.changes });
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      res.status(500).json({ error: 'Failed to fetch users' });
    } else {
      res.json(rows);
    }
  });
});

// Get user by id
app.get('/api/users/:id', (req, res) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      res.status(500).json({ error: 'Failed to fetch user' });
    } else {
      if (row) {
        res.json(row);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  });
});

// Add a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.run(sql, [name, email], function(err) {
    if (err) {
      console.error('Error adding user:', err.message);
      res.status(500).json({ error: 'Failed to add user' });
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});

// Update a user
app.put('/api/users/:id', (req, res) => {
  const { name, email } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.run(sql, [name, email, req.params.id], (err) => {
    if (err) {
      console.error('Error updating user:', err.message);
      res.status(500).json({ error: 'Failed to update user' });
    } else {
      res.json({ message: 'User updated successfully' });
    }
  });
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  db.run(sql, [req.params.id], (err) => {
    if (err) {
      console.error('Error deleting user:', err.message);
      res.status(500).json({ error: 'Failed to delete user' });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
