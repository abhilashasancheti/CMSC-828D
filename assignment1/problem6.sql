/* 
6.1
*/
ALTER TABLE flights
ADD PRIMARY KEY (fid);

ALTER TABLE carriers
ADD PRIMARY KEY (cid);

ALTER TABLE months
ADD PRIMARY KEY (mid);

ALTER TABLE weekdays
ADD PRIMARY KEY (did);

/* 
6.2
*/
ALTER TABLE flights
ADD FOREIGN KEY (carrier_id) REFERENCES carriers(cid);

ALTER TABLE flights
ADD FOREIGN KEY (month_id) REFERENCES months(mid);

ALTER TABLE flights
ADD FOREIGN KEY (day_of_week_id) REFERENCES weekdays(did);

/* 
6.3
*/
INSERT into carriers (cid, name) 
VALUES ('04Q','Dummy Airlines');


INSERT INTO flights
VALUES (-1,8,26,1,'DUMMYID',101,'Los Angles CA','California','Baltimore MD','Maryland',-5,25,-7,0,317,2475,100,451);



/* 
When we tried excecuting the query to add a carrier with existing id, we got the following error.

ERROR:  duplicate key value violates unique constraint "carriers_pkey"
DETAIL:  Key (cid)=(04Q) already exists.

This error was expected because the given cid is a Primary Key for the table carriers and no duplicate entry would be allowed for that attribute. Also, we know the fact that the carrier id '04Q' already exists in the table.

When we tried inserting an entry to the flights table with a carrier_id 'DUMMYID' which doesn't exist in the carriers relation we got the following error. 

ERROR:  insert or update on table "flights" violates foreign key constraint "flights_carrier_id_fkey"
DETAIL:  Key (carrier_id)=(DUMMYID) is not present in table "carriers".

This error was expected because we have applied FOREIGN KEY contraints such that flights.carrier_id references carriers.cid. 
Since we were trying to insert an entry in which the carrier_id is not from one of the id's in the carrier table which the flight table references, we were breaking the Referential Integrity Constraints. 
Had these PRIMARY KEY and FOREIGN KEY constraints not been present in the tables, we would have been able to add the two tuples in the respective tables. 
*/

/* 
6.4
*/
DELETE FROM carriers
WHERE cid = 'AA';

/*
When we tried deleting the entry in carriers corresponding to cid 'AA', we got the following error.

ERROR:  update or delete on table "carriers" violates foreign key constraint "flights_carrier_id_fkey" on table "flights"
DETAIL:  Key (cid)=(AA) is still referenced from table "flights".

This error was expected because 'carriere_id' in flights table is referencing 'cid' of carriers table and deleting it will lead to breaking the referential integrity constraints. 
we will have to delete the tuples corresponding to 'AA' in flights before executing this query.
*/