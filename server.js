var express = require("express");
var bcrypt = require('bcrypt');
var bodyParser = require("body-parser");
var { Pool } = require("pg");
var path = require("path");
var app = express();
var saltRounds = 10;
var myPlaintextPassword = 'user_password';


// PostgreSQL connection pool
var pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "Sp00ky!",
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
  app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "login.html"));
  });
  app.get("/SignUp", function (req, res) {
    res.sendFile(path.join(__dirname, "SignUp.html"));
  });
  app.get("/Users", async function (req, res) {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM Users");
      const Users = result.rows;
      client.release();
      res.send(Users);
    } catch (err) {
      console.error("Error fetching clothes data:", err);
      res.status(500).send(err);
    }
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
app.post("/validate-login", async (req, res) => {
  try {
	const { email, password } = req.body;

	// Fetch the user from the database based on the provided email
	const client = await pool.connect();
	const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
	client.release();

	if (result.rows.length === 1) {
	  // User with the provided email found
	  const user = result.rows[0];

	  // Compare the provided password with the hashed password from the database
	  const isValidPassword = await bcrypt.compare(password, user.password);

	  if (isValidPassword) {
		// Passwords match, login is valid
		res.json({ isValidUser: true });
	  } else {
		// Passwords do not match, login is invalid
		res.json({ isValidUser: false });
	  }
	} else {
	  // No user found with the provided email, login is invalid
	  res.json({ isValidUser: false });
	}
  } 
  catch (err) {
	console.error("Error validating user login:", err);
	res.status(500).json({ error: "Internal Server Error" });
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
  app.post("/Users", async function (req, res) {
    try {
      const { firstname, lastname, dob, email, password } = req.body;
      const client = await pool.connect();
      const result = await client.query(
        "INSERT INTO Users (firstname, lastname, dob, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [firstname, lastname, dob, email, password]
      );
      client.release();
      const newItem = result.rows[0];
      res.send(newItem);
    } catch (err) {
      console.error("Error adding new User:", err);
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
  
  //Hash a password
  async function hashPassword(plainPassword) {
	  return new Promise((resolve, reject) => {
		  bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
			  if(err){
				  reject(err);
			  } else {
				  resolve(hash);
			  }
		  });
	  });
  }
  
  //Verify password
  async function verifyPassword(plainPassword, hashedPassword){
	  return new Promise((resolve, reject) => {
		  bcrypt.compare(plainPassword, hashedPassword, function(err, result){
			  if(err){
				  reject(err);
			  } else {
				  resolve(result);
			  }
		  });
	  });
  }

  //route for user sign up
  app.post("/register", async function (req, res) {
	  try{
		  const { firstname, lastname, dob, email, password } = req.body;
		  const hashedPassword = await hashPassword(password);
		  const client = await pool.connect();
		  const result = await client.query(
			"INSERT INTO Users (firstname, lastname, dob, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *", [firstname, lastname, dob, email, hashedPassword]
		  );
		  client.release();
		  const newUser = result.rows[0];
		  res.send(newUser);
	  } catch (err) {
		  console.error("Error registering new user:", err);
		  res.status(500).send("Internal Server Error");
	  }
  });
  
  //route for user login
  app.post("/userlogin", async (req, res)=> {
	  try{
		  const { email, password} = req.body;
		  const client = await pool.connect();
		  const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
		  client.release();
		  if (result.rows.length === 1) {
			  const user = result.rows[0];
			  const isValidPassword = await verifyPassword(password, user.password);
			if(isValidPassword) {
				res.json({isValidUser: true });
			} else {
				res.json({ isValidUser: false });
			}
		  } 
	  } catch (err) {
			  console.error("Error validating user login:", err);
			  res.status(500).json({ error: "Internal Server Error" });
		  }
	  });

  // ... (similarly, define routes for updating and deleting items)

  // Listen on port 8081 for Express
  app.listen(8081, function () {
    console.log("Server is running on port 8081");
  });
}
