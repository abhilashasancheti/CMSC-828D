import asyncpg
import asyncio
from config import config


# function to query the data for state graph
async def state_data(years,states,months,wcs,severity,ss):
    try:
        params = config()
        con = await asyncpg.connect(**params)
        #print(con)
        if 'all' in years:
            years_filter = " and EXTRACT(year from start_time) in ('2020')"
        else:
            years_filter = ' and EXTRACT(year from start_time) in '+years

        if 'all' in wcs:
            wcs_filter = ''
        else:
            wcs_filter = ' and weather_condition in '+wcs


        if 'all' in months:
            months_filter = '1=1'
        else:
            start_end = months.lstrip('(').rstrip(')').split(',')
            months_filter = 'start_time between '+ start_end[0]+ ' and ' +start_end[1]

        if 'all' in states:
            states_filter = ''
        else:
            states_filter = ' and state in '+states
        
        if 'all' in severity:
            severity_filter = ''
        else:
            severity_filter = ' and severity in '+severity
        
        if 'all' in ss:
            ss_filter = ''
        else:
            ss_filter = ' and sunrise_sunset in '+ss
    
        types = await con.fetch("SELECT state as s,count(*) as value FROM accidents where "+months_filter+years_filter+wcs_filter+ss_filter+severity_filter+" group by state")
    except Exception as e:
        print(str(e))
    finally:
        if con is not None:
            await con.close()
    return types

# function to query the data for severity graph
async def severity_data(years,states,months,wcs,severity,ss):
    try:
        params = config()
        con = await asyncpg.connect(**params)
        #print("not using cache....")
        if 'all' in years:
            years_filter = " and EXTRACT(year from start_time) in ('2020')"
        else:
            years_filter = ' and EXTRACT(year from start_time) in '+years

        if 'all' in wcs:
            wcs_filter = ''
        else:
            wcs_filter = ' and weather_condition in '+wcs

        if 'all' in months:
            months_filter = '1=1'
        else:
            start_end = months.lstrip('(').rstrip(')').split(',')
            months_filter = 'start_time between '+ start_end[0] + ' and ' + start_end[1]

        if 'all' in states:
            states_filter = ''
        else:
            states_filter = ' and state in '+states
        
        if 'all' in severity:
            severity_filter = ''
        else:
            severity_filter = ' and severity in '+severity
        
        if 'all' in ss:
            ss_filter = ''
        else:
            ss_filter = ' and sunrise_sunset in '+ss
        types = await con.fetch("SELECT severity as sev,count(*) as value FROM accidents where "+months_filter+years_filter+wcs_filter+ss_filter+states_filter+" group by severity")
    except Exception as e:
        print(str(e))
    finally:
        if con is not None:
            await con.close()
    return types

# function to query the data for weather_condition graph
async def weather_condition_data(years,states,months,wcs,severity,ss):
    try:
        params = config()
        con = await asyncpg.connect(**params)
        #print("not using cache....")
        if 'all' in years:
            years_filter = " and EXTRACT(year from start_time) in ('2020')"
        else:
            years_filter = ' and EXTRACT(year from start_time) in '+years

        if 'all' in wcs:
            wcs_filter = ''
        else:
            wcs_filter = ' and weather_condition in '+wcs

        if 'all' in months:
            months_filter = '1=1'
        else:
            start_end = months.lstrip('(').rstrip(')').split(',')
            months_filter = 'start_time between '+ start_end[0] + ' and ' + start_end[1]

        if 'all' in states:
            states_filter = ''
        else:
            states_filter = ' and state in '+states
        
        if 'all' in severity:
            severity_filter = ''
        else:
            severity_filter = ' and severity in '+severity
        
        if 'all' in ss:
            ss_filter = ''
        else:
            ss_filter = ' and sunrise_sunset in '+ss

        types = await con.fetch("SELECT weather_condition as wc, count(*) as value FROM accidents where "+months_filter+years_filter+states_filter+ss_filter+severity_filter+" group by weather_condition")
    except Exception as e:
        print(str(e))
    finally:
        if con is not None:
            await con.close()
    return types

# function to query the data for day_night graph
async def day_night_data(years,states,months,wcs,severity,ss):
    try:
        params = config()
        con = await asyncpg.connect(**params)
        #print("not using cache....")
        if 'all' in years:
            years_filter = " and EXTRACT(year from start_time) in ('2020')"
        else:
            years_filter = ' and EXTRACT(year from start_time) in '+years

        if 'all' in wcs:
            wcs_filter = ''
        else:
            wcs_filter = ' and weather_condition in '+wcs

        if 'all' in months:
            months_filter = '1=1'
        else:
            start_end = months.lstrip('(').rstrip(')').split(',')
            months_filter = 'start_time between '+ start_end[0] + ' and ' + start_end[1]

        if 'all' in states:
            states_filter = ''
        else:
            states_filter = ' and state in '+states
        
        if 'all' in severity:
            severity_filter = ''
        else:
            severity_filter = ' and severity in '+severity
        
        if 'all' in ss:
            ss_filter = ''
        else:
            ss_filter = ' and sunrise_sunset in '+ss

        types = await con.fetch("SELECT sunrise_sunset as ss,count(*) as value FROM accidents where "+months_filter+years_filter+wcs_filter+states_filter+severity_filter+" group by sunrise_sunset")
    except Exception as e:
        print(str(e))
    finally:
        if con is not None:
            await con.close()
    return types

# function to query the data for monthly_accidents graph
async def monthly_accidents_data(years,states,months,wcs,severity,ss):
    try:
        params = config()
        con = await asyncpg.connect(**params)
        #print("not using cache....")
        if 'all' in years:
            years_filter = " and EXTRACT(year from start_time) in ('2020')"
        else:
            years_filter = ' and EXTRACT(year from start_time) in '+years

        if 'all' in wcs:
            wcs_filter = ''
        else:
            wcs_filter = ' and weather_condition in '+wcs

        if 'all' in months:
            months_filter = '1=1'
        else:
            start_end = months.lstrip('(').rstrip(')').split(',')
            months_filter = 'start_time between '+ start_end[0] + ' and ' + start_end[1]

        if 'all' in states:
            states_filter = ''
        else:
            states_filter = ' and state in '+states
        
        if 'all' in severity:
            severity_filter = ''
        else:
            severity_filter = ' and severity in '+severity
        
        if 'all' in ss:
            ss_filter = ''
        else:
            ss_filter = ' and sunrise_sunset in '+ss
        types = await con.fetch("SELECT start_time as st,count(*) as value FROM accidents where 1=1"+ years_filter+wcs_filter+ss_filter+states_filter+severity_filter+" group by start_time")
    except Exception as e:
        print(str(e))
    finally:
        if con is not None:
            await con.close()
    return types
