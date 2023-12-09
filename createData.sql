CREATE TABLE clothes (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255),
  product_description VARCHAR(255)
);

-- Add "gender", "price" and "image" columns to the "clothes" table
ALTER TABLE clothes
add column gender varchar(10)
ADD COLUMN price DECIMAL(10, 2), 
ADD COLUMN image VARCHAR(255);

INSERT INTO clothes (product_name, product_description, price, image, gender)
VALUES ('Black Jacket', 'Long Black Winter Jacket', 29.99, 'https://www.emp.ie/dw/image/v2/BBQV_PRD/on/demandware.static/-/Sites-master-emp/default/dw85d2feaf/images/4/6/6/9/466989a.jpg?sfrm=png', 'Mens');
INSERT INTO clothes (product_name, product_description, price, image, gender)
VALUES ('Fur Jacket', 'Comfortable fur-Leather jacket', 19.99, 'https://img.fruugo.com/product/4/36/655926364_max.jpg', 'Mens');
INSERT INTO clothes (product_name, product_description, price, image, gender)
VALUES ('Red Jacket', 'Puffy Red Bubble Jacket', 39.99, 'https://img01.ztat.net/article/spp-media-p1/3783e9e259c444f996cb499951095a57/6cd3b6e88aa74f1b8461c9b91c70b43a.jpg?imwidth=1800', 'Mens');

