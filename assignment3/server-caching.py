#!/usr/bin/python
import json
from pymemcache.client import base
from pymemcache import fallback
from flask import Flask, render_template, request
from helper_functions import *
import asyncpg
import asyncio
import datetime

# configuring caching
old_cache = base.Client(('localhost', 11211), ignore_exc=True)
new_cache = base.Client(('localhost', 11211))

client = fallback.FallbackClient((new_cache, old_cache))


app = Flask(__name__)


# deining utility dictionaries 
month_dict = {'January':'01', 'February':'02', 'March':'03','April':'04','May':'05','June':'06','July':'07','August':'08','September':'09','October':'10','November':'11','December':'12'}
shift_month = {'01':'12', '02':'01','03':'02','04':'03','05':'04','06':'05','07':'06','08':'07','09':'08','10':'09','11':'10','12':'11'}
shift_year = {'2016':'2015','2017':'2016','2018':'2017','2019':'2018', '2020':'2019'}
end_date = {'01':'31','02':'28','03':'31','04':'30','05':'31','06':'30','07':'31','08':'31','09':'30','10':'31','11':'30','12':'31'}

# convert datetime to become json serializable
def myconverter(o):
    if isinstance(o, datetime.date):
    	return o.strftime("%Y-%m-%d")

# read arguments form the get request
def read_arguments():
	years = str(request.args.getlist('years')).replace('[','(').replace(']',')')
	states = str(request.args.getlist('states')).replace('[','(').replace(']',')')
	months = process_month(str(request.args.getlist('months')))
	wcs = str(request.args.getlist('wcs')).replace('[','(').replace(']',')')
	severity = request.args.getlist('severity')
	if 'all' in severity:
		severity = str(severity).replace('[','(').replace(']',')')
	else:
		severity = str([int(i) for i in severity]).replace('[','(').replace(']',')')
	ss = str(request.args.getlist('ss')).replace('[','(').replace(']',')')
	return (years,states,months,wcs,severity,ss)

# process month filter to create start and end dates. Filter on UI shows range as [start_month,end_month) so shiting the end month
def process_month(months):
	#print(months)
	months_year = months.strip("'][").split(' -> ')
	#print(months_year)
	if len(months_year)>1:
		months_year_list = [month.split(' ') for month in months_year]
		month_filter = [month_dict[months_year_list[0][0]], shift_month[month_dict[months_year_list[1][0]]]]
		year_filter = [year if not months_year_list[1][0]=='01' else shift_year[year] for (month,year) in months_year_list]
		st_filter = str([year_filter[0]+'-'+month_filter[0]+'-01', year_filter[1]+'-'+month_filter[1]+'-'+end_date[month_filter[1]]]).replace('[','(').replace(']',')')
	else:
		st_filter="('all')"
	return st_filter

def remove_spaces(key):
	key = key.split(",")
	key = ''.join([i.strip() for i in key])
	return key

def replace_spaces(key):
	key = key.split(",")
	key = ''.join([i.replace(' ','_') for i in key])
	return key



@app.route('/state_chart', methods=['GET', 'POST'])
def state_chart():
	years,states,months,wcs,severity,ss = read_arguments()
	#print(states,months,wcs,severity,ss)
	#print(datetime.date(2019, 3, 31).strftime("%Y-%m-%d"))
	key = 'y'+remove_spaces(years)+'m'+remove_spaces(months)+'w'+replace_spaces(remove_spaces(wcs))+'s'+remove_spaces(severity)+'ss'+remove_spaces(ss)
	#print(key)
	result = client.get(key)
	if result is None:
		# The cache is empty, need to get the value 
		# from the canonical source:
		loop = asyncio.new_event_loop()
		asyncio.set_event_loop(loop)
		fetched_data = loop.run_until_complete(state_data(years,states,months,wcs,severity,ss))
		result = json.dumps([list(i.values()) for i in fetched_data],default = myconverter,indent=4)
		client.set(key,result)
	return result


@app.route('/monthly_accidents_chart', methods=['GET', 'POST'])
def monthly_accidents_chart():
	years,states,months,wcs,severity,ss = read_arguments()
	key = 'y'+remove_spaces(years)+'st'+remove_spaces(states)+'w'+replace_spaces(remove_spaces(wcs))+'s'+remove_spaces(severity)+'ss'+remove_spaces(ss)
	result = client.get(key)
	if result is None:
		loop = asyncio.new_event_loop()
		asyncio.set_event_loop(loop)
		fetched_data = loop.run_until_complete(monthly_accidents_data(years,states,months,wcs,severity,ss))
		result = json.dumps([list(i.values()) for i in fetched_data],default = myconverter,indent=4)
		client.set(key,result)
	return result


@app.route('/day_night_chart', methods=['GET', 'POST'])
def day_night_chart():
	years,states,months,wcs,severity,ss = read_arguments()
	key = 'y'+remove_spaces(years)+'st'+remove_spaces(states)+'m'+remove_spaces(months)+'w'+replace_spaces(remove_spaces(wcs))+'s'+remove_spaces(severity)
	result = client.get(key)
	if result is None:
		loop = asyncio.new_event_loop()
		asyncio.set_event_loop(loop)
		fetched_data = loop.run_until_complete(day_night_data(years,states,months,wcs,severity,ss))
		result = json.dumps([list(i.values()) for i in fetched_data],default = myconverter,indent=4)
		client.set(key,result)
	return result


@app.route('/severity_chart', methods=['GET', 'POST'])
def severity_chart():
	years,states,months,wcs,severity,ss = read_arguments()
	key = 'y'+remove_spaces(years)+'st'+remove_spaces(states)+'m'+remove_spaces(months)+'w'+replace_spaces(remove_spaces(wcs))+'ss'+remove_spaces(ss)
	result = client.get(key)
	if result is None:
		loop = asyncio.new_event_loop()
		asyncio.set_event_loop(loop)
		fetched_data = loop.run_until_complete(severity_data(years,states,months,wcs,severity,ss))
		result = json.dumps([list(i.values()) for i in fetched_data],default = myconverter,indent=4)
		client.set(key,result)
	return result


@app.route('/weather_condition_chart', methods=['GET', 'POST'])
def weather_condition_chart():
	years,states,months,wcs,severity,ss = read_arguments()
	key = 'y'+remove_spaces(years)+'st'+remove_spaces(states)+'m'+remove_spaces(months)+'s'+remove_spaces(severity)+'ss'+remove_spaces(ss)
	result = client.get(key)
	if result is None:
		loop = asyncio.new_event_loop()
		asyncio.set_event_loop(loop)
		fetched_data = loop.run_until_complete(weather_condition_data(years,states,months,wcs,severity,ss))
		result = json.dumps([list(i.values()) for i in fetched_data],default = myconverter, indent=4)
		client.set(key,result)
	return result

@app.route("/")
def index():
    return render_template("index.html")


@app.route('/instructions')
def instructions():
	return render_template("instructions.html")


if __name__ == "__main__":
    app.run(port=8080,debug=True)





