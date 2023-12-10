var express = require("express");
var session = require("express-session");
var bcrypt = require('bcrypt');
var bodyParser = require("body-parser");
var { Pool } = require("pg");
var path = require("path");
var app = express();
var saltRounds = 10;
var myPlaintextPassword = 'user_password';


//PostgreSQL connection pool
var pool = new Pool({
  user: "BUILDER",
  host: "localhost",
  database: "postgres",
  password: "password",
  port: 54321,
});

/*Aarons database
 var pool = new Pool({
     user: "postgres",
     host: "localhost",
     database: "postgres",
     password: "Sp00ky!",
     port: 54321,
   });*/

// Set up session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  }));
  

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
  app.get("/mens", function (req, res) {
    res.sendFile(path.join(__dirname, "Mens.html"));
  });
  app.get("/womens", function (req, res) {
    res.sendFile(path.join(__dirname, "Womens.html"));
  });
  app.get("/loginError", function (req, res) {
    res.sendFile(path.join(__dirname, "loginError.html"));
  });
  app.get("/SignUp", function (req, res) {
    res.sendFile(path.join(__dirname, "SignUp.html"));
  });
  app.get("/basket", function (req, res) {
    res.sendFile(path.join(__dirname, "basket.html"));
  });

  function authenticateUser(req, res, next) {
    // If the user is authenticated (user ID is stored in the session), proceed to the next middleware
    if (req.session.userId) {
      return next();
    } else {
      // If not authenticated, redirect to the login page or send an unauthorized response
      res.sendFile(path.join(__dirname, "loginError.html"));
    }
  }
  
  app.get("/inventory", authenticateUser, function (req, res) {
    res.sendFile(path.join(__dirname, "inventory.html"));
  });
  
  //route for logout of sessions and users
  app.get("/logout", async (req, res) => {
    try {
        // Add the code to update the "inBasket" status for all items to false
        const client = await pool.connect();
        const result = await client.query("UPDATE clothes SET inBasket = $1 WHERE inBasket = $2 RETURNING *", [false, true]);
        client.release();
        const updatedItems = result.rows;

        // Destroy the session after updating the basket status
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                res.status(500).send("Internal Server Error");
            } else {
                res.redirect("/login");
            }
        });
    } catch (error) {
        console.error('Error updating basket and destroying session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  app.get("/Users", async function (req, res) {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM Users");
      const Users = result.rows;
      client.release();
      res.send(Users);
    } catch (err) {
      console.error("Error fetching users data:", err);
      res.status(500).send(err);
    }
  });
  
  // Define a route for fetching user data
app.get("/user", async function (req, res) {
    try {
        if (req.session.userId) {
            const client = await pool.connect();
            const result = await client.query("SELECT email FROM Users WHERE id = $1", [req.session.userId]);
            client.release();

            if (result.rows.length === 1) {
                const userEmail = result.rows[0].email;
                // Send the user's email in the response
                res.json({ userId: req.session.userId, userEmail: userEmail });
            } else {
                // Handle the case where the user is not found
                res.status(404).json({ error: "User not found" });
            }
        } else {
            // User is not logged in, send an empty response or an appropriate indicator
            res.json(null);
        }
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: "Internal Server Error" });
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

  
  // Define a route for adding a new item of clothing (POST request)
  app.post("/clothes", async function (req, res) {
    try {
        const { product_name, product_description, price, image, gender } = req.body;
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO clothes (product_name, product_description, price, image, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [product_name, product_description, price, image, gender]
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
        const { id, product_name, product_description, price, image, gender } = req.body;
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE clothes SET product_name = $1, product_description = $2, price = $3, image = $4, gender = $5 WHERE id = $6 RETURNING *",
            [product_name, product_description, price, image, gender, id]
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
  
	//route for getting clothes for men
	app.get("/clothes/mens", async function (req, res) {
	  try {
		const client = await pool.connect();
		const result = await client.query("SELECT * FROM clothes WHERE gender = 'Mens'");
		const clothes = result.rows;
		client.release();
		res.send(clothes);
	  } catch (err) {
		console.error("Error fetching men's clothes data:", err);
		res.status(500).send(err);
	  }
	});
	//route for getting clothes for women
	app.get("/clothes/womens", async function (req, res) {
	  try {
		const client = await pool.connect();
		const result = await client.query("SELECT * FROM clothes WHERE gender = 'Womens'");
		const clothes = result.rows;
		client.release();
		res.send(clothes);
	  } catch (err) {
		console.error("Error fetching men's clothes data:", err);
		res.status(500).send(err);
	  }
	});

    app.get("/clothes/basket", async function (req, res) {
        try {
          const client = await pool.connect();
          const result = await client.query("SELECT * FROM clothes WHERE inBasket = 'True'");
          const clothes = result.rows;
          client.release();
          res.send(clothes);
        } catch (err) {
          console.error("Error fetching basket data:", err);
          res.status(500).send(err);
        }
      });

      app.put("/clothes/:productId/add-to-basket", async function (req, res) {
        try {
          const productId = req.params.productId;
          const client = await pool.connect();
          const result = await client.query(
            "UPDATE clothes SET inBasket = $1 WHERE id = $2 RETURNING *",
            [true, productId]
          );
          client.release();
          const updatedItem = result.rows[0];
          res.send(updatedItem);
        } catch (err) {
          console.error("Error updating item of clothing to basket:", err);
          res.status(500).send("Internal Server Error");
        }
      });

      app.put("/clothes/:productId/remove-from-basket", async function (req, res) {
        try {
          const productId = req.params.productId;
          const client = await pool.connect();
          const result = await client.query(
            "UPDATE clothes SET inBasket = $1 WHERE id = $2 RETURNING *",
            [false, productId]
          );
          client.release();
          const updatedItem = result.rows[0];
          res.send(updatedItem);
        } catch (err) {
          console.error("Error updating item of clothing to basket:", err);
          res.status(500).send("Internal Server Error");
        }
      });


app.put('/clothes/pay-basket', async (req, res) => {
  try {
    console.log("Server received pay-basket request");
    // Update the "inBasket" status for all items to false
    const client = await pool.connect();
    const result = await client.query("UPDATE clothes SET inBasket = $1 WHERE inBasket = $2 RETURNING *", [false, true]);
    client.release();

    const updatedItems = result.rows;
    res.json({ message: 'Basket paid successfully.', updatedItems });
  } catch (error) {
    console.error('Error paying basket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
              req.session.userId = user.id;
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
