#!/bin/bash

###############################################################################
#
# File: setup.bash
# Author: Abhilasha Sancheti <sancheti@cs.umd.edu>
# Last updated: Oct 19, 2019
#
# This bash script is required to be run from the folder in which it exists
#
###############################################################################

# cd into the current directory where server.py and datafile exists
cd "$(dirname "$0")"

# installing memcached for server-side caching optimization
#copy the below lines and run in another terminal if you want to have serve-side caching
#brew install memcached
#memcached
 
# install python libraries
pip install asyncpg asyncio
pip install Flask
pip install pymemcache

echo "installed libraries...."
dbname=a3db
dbuser=a3user
password=password

# create table, insert data and create index
PGPASSWORD=$password psql -d $dbname -U $dbuser -w -c "CREATE TABLE accidents (ID varchar(10), Severity int, Start_Time date, State varchar(25), Weather_Condition varchar(50), Sunrise_Sunset varchar(8));"
PGPASSWORD=$password psql -d $dbname -U $dbuser -w -c "\copy accidents from US_accidents.csv (format csv, header true)"
PGPASSWORD=$password psql -d $dbname -U $dbuser -w -c "CREATE INDEX idx_accidents_severity on accidents(severity);"
PGPASSWORD=$password psql -d $dbname -U $dbuser -w -c "CREATE INDEX idx_accidents_weather_condition on accidents(weather_condition);"
PGPASSWORD=$password psql -d $dbname -U $dbuser -w -c "CREATE INDEX idx_accidents_state on accidents(state);"
PGPASSWORD=$password psql -d $dbname -U $dbuser -w -c "CREATE INDEX idx_accidents_start_time on accidents(start_time);"
PGPASSWORD=$password psql -d $dbname -U $dbuser -w -c "CREATE INDEX idx_accidents_sunrise_sunset on accidents(sunrise_sunset);"
echo "database ready...."
# run the server listening at localhost:8080 - python server-caching.py for caching to work
python server.py




