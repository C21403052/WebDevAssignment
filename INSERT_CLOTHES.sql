--drop table clothes;
 CREATE TABLE clothes (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255),
  product_description VARCHAR(255),
  gender VARCHAR(10),
  price DECIMAL(10, 2),
  image VARCHAR(255),
  inBasket BOOLEAN DEFAULT false
);

INSERT INTO clothes (product_name, product_description, price, image, gender, inBasket)
VALUES 
  ('Summer Dress', 'Floral Summer Sundress', 39.99, 'https://img.fruugo.com/product/7/87/754985877_max.jpg', 'Womens', false),
  ('High Heels', 'Black High Heel Shoes', 59.99, 'https://i.etsystatic.com/17572206/r/il/d615dc/3456430959/il_570xN.3456430959_canj.jpg', 'Womens', false),
  ('Casual Blouse', 'Light Blue Casual Blouse', 24.99, 'https://m.media-amazon.com/images/I/611LekoPN0L._AC_UF894,1000_QL80_.jpg', 'Womens', false),
  ('Skinny Jeans', 'Black Skinny Fit Jeans', 34.99, 'https://cdn-img.prettylittlething.com/a/9/0/d/a90dde0ae814c9405a029182a9e1963872491217_cmd9877_1.jpg?imwidth=300', 'Womens', false),
  ('Winter Coat', 'Warm Winter Coat with Hood', 79.99, 'https://img.fruugo.com/product/5/38/470933385_max.jpg', 'Womens', false),
  ('Elegant Gown', 'Red Carpet Elegant Gown', 149.99, 'https://www.theoutnet.com/variants/images/1647597318816234/F/w1020_q80.jpg', 'Womens', false),
  ('Leather Jacket', 'Stylish Leather Jacket', 89.99, 'https://i.etsystatic.com/15993590/r/il/c07ca3/2591878750/il_570xN.2591878750_gca1.jpg', 'Womens', false),
  ('Boho Chic Skirt', 'Bohemian Boho Chic Skirt', 44.99, 'https://i.etsystatic.com/15471207/r/il/0e9e86/4090491646/il_570xN.4090491646_l77i.jpg', 'Womens', false),
  ('Sporty Sneakers', 'White Sporty Sneakers', 49.99, 'https://img.fruugo.com/product/8/04/718103048_max.jpg', 'Womens', false),
  ('Formal Blazer', 'Classic Formal Black Blazer', 74.99, 'https://i.etsystatic.com/27662165/r/il/01e835/4158790567/il_570xN.4158790567_vy0r.jpg', 'Womens', false),
  ('Denim Jeans', 'Classic Blue Denim Jeans', 59.99, 'https://image.made-in-china.com/2f0j00RlgkpjOZnrob/Custom-American-Style-Classic-Blue-Washed-Denim-Loose-Baggy-Men-Denim-Jeans.jpg', 'Mens', false),
  ('Hooded Sweatshirt', 'Warm Hooded Sweatshirt', 34.99, 'https://img.fruugo.com/product/3/21/589853213_max.jpg', 'Mens', false),
  ('Casual Sneakers', 'Casual Comfortable Sneakers', 54.99, 'https://cdnimg.brunomarcshoes.com/brunomarcs/image/article/20220818_79/grand-01-men-mesh-sneakers-with-pants-0sd.jpg', 'Mens', false),
  ('Business Suit', 'Formal Business Suit', 129.99, 'https://i.pinimg.com/236x/e1/ea/c0/e1eac091960cb6b0cd375d2c0088c8df.jpg', 'Mens', false),
  ('Winter Hat', 'Stylish Winter Hat', 24.99, 'https://i.pinimg.com/564x/89/44/94/894494c8c3ef8ebb9e960b3c9d09294c.jpg', 'Mens', false),
  ('Leather Jacket', 'Classic Leather Jacket', 79.99, 'https://youraverageguystyle.com/wp-content/uploads/2021/06/Bodaskins-Classic-Biker-Jacket-Review-1.jpg', 'Mens', false),
  ('Sporty Watch', 'Digital Sporty Watch', 44.99, 'https://www.cakcity.com/cdn/shop/products/61woob6-BLL._UL1500_1024x1024.jpg?v=1651041996', 'Mens', false),
  ('Black Jacket', 'Long Black Winter Jacket', 29.99, 'https://www.emp.ie/dw/image/v2/BBQV_PRD/on/demandware.static/-/Sites-master-emp/default/dw85d2feaf/images/4/6/6/9/466989a.jpg?sfrm=png', 'Mens', false),
  ('Fur Jacket', 'Comfortable fur-Leather jacket', 19.99, 'https://img.fruugo.com/product/4/36/655926364_max.jpg', 'Mens', false),
  ('Red Jacket', 'Puffy Red Bubble Jacket', 39.99, 'https://img01.ztat.net/article/spp-media-p1/3783e9e259c444f996cb499951095a57/6cd3b6e88aa74f1b8461c9b91c70b43a.jpg?imwidth=1800', 'Mens', true);
