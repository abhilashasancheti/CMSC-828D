/* 3.1 */
insert into carriers(cid,name) values(-1, 'my carrier');


/* 3.2 */
\copy flights from assignment1/flights.csv CSV
\copy carriers from assignment1/carriers.csv CSV
\copy months from assignment1/months.csv CSV
\copy weekdays from assignment1/weekdays.csv CSV


/* 3.3 */
delete from carriers where cid='-1'; 
