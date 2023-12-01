CREATE TABLE clothes (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255),
  product_description VARCHAR(255)
);

-- Inserting data into the clothes table
INSERT INTO clothes (product_name, product_description) VALUES ('Sweater', 'Warm and comfortable');
INSERT INTO clothes (product_name, product_description) VALUES ('Winter Jacket', 'Waterproof and stylish');
INSERT INTO clothes (product_name, product_description) VALUES ('Scarves', 'Assorted colors and designs');
INSERT INTO clothes (product_name, product_description) VALUES ('Snow Boots', 'Durable and insulated');
