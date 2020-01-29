/* 
4.1
*/
SELECT DISTINCT c.name
FROM flights AS f,carriers AS c
WHERE f.carrier_id = c.cid
GROUP BY f.month_id , f.day_of_month, c.name
HAVING COUNT(*) > 1000;

/* 
4.2
*/
SELECT c.name AS carrier, max(f.price) AS max_price
FROM flights AS f,carriers AS c
WHERE f.carrier_id = c.cid AND ((f.origin_city='Washington DC' AND f.dest_city='Seattle WA') OR (f.dest_city='Washington DC' AND f.origin_city='Seattle WA'))
GROUP BY c.name;

/* 
4.3
*/
SELECT DISTINCT f.flight_num AS flight_num 
FROM flights AS f 
WHERE f.origin_city like 'Seattle%' AND f.dest_city like 'Boston%' AND
carrier_id=(SELECT c.cid from carriers as c WHERE c.name='Alaska Airlines Inc.') AND day_of_week_id=(SELECT w.did from weekdays as w WHERE w.day_of_week='Monday');

/*
4.4
*/
SELECT c.cid, c.name
FROM flights AS f, carriers AS c
WHERE f.carrier_id=c.cid
GROUP BY c.name, c.cid
ORDER BY COUNT(DISTINCT f.flight_num) ASC limit 1;

/* 
4.5
*/
SELECT w.did, w.day_of_week from weekdays As w where w.did IN ( SELECT f.day_of_week_id FROM flights AS f
GROUP BY f.day_of_week_id
ORDER BY AVG(f.price) DESC limit 1);

/* 
4.6
*/
SELECT c.name as name, (100.0*SUM(f.canceled)/count(*)) AS percent
FROM flights AS f,carriers AS c
WHERE f.carrier_id = c.cid and f.origin_city='Washington DC'
GROUP BY c.name
HAVING (100.0*SUM(f.canceled)/count(*)) > 0.5
ORDER BY percent ASC;

/* 
4.7
*/
SELECT c.name as name, SUM(f.departure_delay) AS delay 
FROM carriers AS c, flights AS f
WHERE c.cid=f.carrier_id
GROUP BY c.name;

/* 
4.8
*/
SELECT c.name AS name, f1.flight_num AS f1_flight_num, f1.origin_city AS f1_origin_city, 
f1.dest_city AS f1_dest_city, f1.actual_time AS f1_actual_time, f2.flight_num AS f2_flight_num, f2.origin_city AS f2_origin_city, f2.dest_city AS f2_dest_city, f2.actual_time AS f2_actual_time, (f1.actual_time+f2.actual_time) AS actual_time 
FROM flights AS f1, flights AS f2, carriers AS c, months AS m
WHERE f1.carrier_id = c.cid AND f1.carrier_id=f2.carrier_id AND f1.origin_city='Washington DC' AND f2.dest_city='Las Vegas NV' AND f1.dest_city=f2.origin_city AND f1.day_of_month=15 AND f2.day_of_month=15 AND f1.month_id=m.mid AND f2.month_id=m.mid AND m.month='July' 
AND f1.actual_time + f2.actual_time < 480;