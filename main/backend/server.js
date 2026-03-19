const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// Serve frontend files
app.use(express.static(path.join(__dirname, "..")));

const db = new sqlite3.Database("recipes.db");

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT
)
`);

// Insert sample recipe if table empty
db.get("SELECT COUNT(*) AS count FROM recipes", (err, row) => {
  if (err) {
    console.error("Database error:", err.message);
    return;
  }

  if (row.count === 0) {
    db.run(
      "INSERT INTO recipes (name, description) VALUES (?, ?)",
      ["Sample Recipe", "This is a test recipe"]
    );
  }
});

// Home route → load index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Get all recipes
app.get("/recipes", (req, res) => {
  db.all("SELECT * FROM recipes", (err, rows) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(rows);
    }
  });
});

// Add new recipe
app.post("/recipes", (req, res) => {
  const { name, description } = req.body;

  db.run(
    "INSERT INTO recipes (name, description) VALUES (?, ?)",
    [name, description],
    function (err) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});