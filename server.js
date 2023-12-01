var express = require("express");
var bodyParser = require("body-parser");
var { Pool } = require("pg");
var path = require("path");
var app = express();

// PostgreSQL connection pool
var pool = new Pool({
  user: "BUILDER",
  host: "localhost",
  database: "postgres",
  password: "password",
  port: 54321,
});

// Attempt to connect to the database
pool.connect()
  .then(() => {
    console.log('Connected to the database');
    // Start the Express server only if the database connection is successful
    startServer();
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

// Function to start the Express server
function startServer() {
  // Parse JSON bodies for POST, PUT, and DELETE requests
  app.use(bodyParser.json());

  // Serve the HTML file
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "project_main.html"));
  });

  // Define a route for the /clothes endpoint in Express
  app.get("/clothes", async function (req, res) {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM clothes");
      const clothes = result.rows;
      client.release();
      res.send(clothes);
    } catch (err) {
      console.error("Error fetching clothes data:", err);
      res.status(500).send(err);
    }
  });

  // Define a route for adding a new item of clothing (POST request)
  app.post("/clothes", async function (req, res) {
    try {
      const { product_name, product_description } = req.body;
      const client = await pool.connect();
      const result = await client.query(
        "INSERT INTO clothes (product_name, product_description) VALUES ($1, $2) RETURNING *",
        [product_name, product_description]
      );
      client.release();
      const newItem = result.rows[0];
      res.send(newItem);
    } catch (err) {
      console.error("Error adding item of clothing:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  // Define a route for updating an item of clothing (PUT request)
  app.put("/clothes", async function (req, res) {
    try {
      const { id, product_name, product_description } = req.body;
      const client = await pool.connect();
      const result = await client.query(
        "UPDATE clothes SET product_name = $1, product_description = $2 WHERE id = $3 RETURNING *",
        [product_name, product_description, id]
      );
      client.release();
      const updatedItem = result.rows[0];
      res.send(updatedItem);
    } catch (err) {
      console.error("Error updating item of clothing:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  // Define a route for deleting an item of clothing (DELETE request)
  app.delete("/clothes", async function (req, res) {
    try {
      const { id } = req.body;
      const client = await pool.connect();
      const result = await client.query(
        "DELETE FROM clothes WHERE id = $1 RETURNING *",
        [id]
      );
      client.release();
      const deletedItem = result.rows[0];
      res.send(deletedItem);
    } catch (err) {
      console.error("Error deleting item of clothing:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  // ... (similarly, define routes for updating and deleting items)

  // Listen on port 8081 for Express
  app.listen(8081, function () {
    console.log("Server is running on port 8081");
  });
}
