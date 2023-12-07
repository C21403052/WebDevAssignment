create table Users (
	id SERIAL primary key,
	firstname VARCHAR(255),
	lastname VARCHAR(255),
	dob DATE,
	email VARCHAR(255),
	password VARCHAR(255)
);

insert into Users (firstname, lastname, dob, email, password) values ('Aaron', 'Burton', '2001-12-04', 'aaronb2001@gmail.com', 'password1');
insert into Users (firstname, lastname, dob, email, password) values ('Peter', 'Griffin', '1990-10-14', 'pg1990@gmail.com', 'password2');
insert into Users (firstname, lastname, dob, email, password) values ('Lara', 'Martin', '2003-02-20', 'lamartin1@gmail.com', 'password3');
insert into Users (firstname, lastname, dob, email, password) values ('Connor', 'Jeffmon', '1981-01-01', 'cjeff81@gmail.com', 'password4');

select * from users;
