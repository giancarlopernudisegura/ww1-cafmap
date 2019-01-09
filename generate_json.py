# Author : Will Fenton
# Email  : wfenton@ualberta.ca
# Date   : 02/01/2019


import sqlite3
import json


# Connect to database
db_connection = sqlite3.connect("ww1.db")
cursor = db_connection.cursor()

#------ Mapbox Json ------#

# Setup data for mapbox
data = {
    "type"     : "FeatureCollection",
    "features" : []
}

# Get all month / country data from database
cursor.execute("SELECT month_int, country, deaths FROM CountryMonth ORDER BY month_int;")

# Iterate through country / month pairs, creating datapoints for each and adding them to the data dictionary
for row in cursor:

    # Unpack row
    month, country, death_count = row

    # Create datapoint object
    datapoint = {
        "type"       : "Feature",
        "properties" : {
            "death_count" : int(death_count),
            "time"        : int(month)
        },
        "geometry"   : {
            "type"        : "Point",
            "country"     : country
        }
    }

    # Add to data dictionary
    data["features"].append(datapoint)


# Dump data dictionary to json file
with open("data.geojson", 'w') as outfile:  
    json.dump(data, outfile)
outfile.close()

#------ Deaths Json ------#

# Get deaths per month from database
cursor.execute("SELECT month_int, SUM(deaths) FROM CountryMonth GROUP BY month_int;")

data = {}

# Enter data into dictionary
for row in cursor:
    data[row[0]] = row[1]

# Dump data dictionary to json file
with open("deaths.json", 'w') as outfile:  
    json.dump(data, outfile)
outfile.close()

# Close connection
db_connection.close()
