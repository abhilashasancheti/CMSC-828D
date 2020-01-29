CREATE TABLE flights( fid int, month_id int, day_of_month int, day_of_week_id int, carrier_id varchar(7), flight_num int, origin_city varchar(34), origin_state varchar(47), dest_city varchar(34), dest_state varchar(46), departure_delay int, taxi_out int, arrival_delay int, canceled int, actual_time int, distance int, capacity int, price int);

CREATE TABLE carriers(cid varchar(7), name varchar(83));

CREATE TABLE months(mid int, month varchar(9));

CREATE TABLE weekdays(did int, day_of_week varchar(9));