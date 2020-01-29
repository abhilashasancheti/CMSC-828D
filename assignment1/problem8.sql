/* 
8.1
*/
CREATE VIEW flights_under_700 AS
SELECT *
FROM flights
WHERE price<700;

/* 
8.2
*/
SELECT * 
FROM flights_under_700 
WHERE origin_city LIKE '%Fort%' OR dest_city LIKE '%Fort%';

/* 
8.3
*/
CREATE VIEW carrier_and_weekdays AS 
SELECT w.did, w.day_of_week, c.cid, c.name
FROM flights AS f, carriers AS c, weekdays AS w
WHERE f.carrier_id=c.cid AND f.day_of_week_id=w.did;

/* 
8.4
*/
/*
Benefits of using views:
a. Views are virtual table creatd from one or more tables so they help in simplifying the data access.
b. They can be used as a more user-centred and user-specific way of presenting/structuring only that data from the existing tables that he might need. 
c. Only a subset of the data can be analyzed and presented.
d. It also gives us a way to improve data security by just displaying user-centric information. Selecting only the rows specific to a user.
e. Also, it is a good way of summarising the data such that it can provide some meaningful insights.
*/

/*
8.5
*/
/*
If we try to insert a tuple into one of the created views then we get the following error:

ERROR:  cannot insert into view "carrier_and_weekdays"
DETAIL:  Views that do not select from a single table or view are not automatically updatable.
HINT:  To enable inserting into the view, provide an INSTEAD OF INSERT trigger or an unconditional ON INSERT DO INSTEAD rule.

In my opinion, inserts and updates should not be allowed on Views because there main purpose is as mentioned in 8.4. They are Views and should be used to provide read-only access to the users.
If inserts and updates are allowed in views then they are serving the same purpose as the usual tables.

However, it is possible to update the tuple of a View if some restrictions on the schema are followed.
