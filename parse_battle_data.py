# Author : Will Fenton
# Email  : wfenton@ualberta.ca
# Date   : 02/01/2019


import sqlite3
import json
from datetime import datetime


# Establish connection to database, also creates database if it doesn't already exist
db_connection = sqlite3.connect("./ww1.db")
cursor = db_connection.cursor()

# Drop table
cursor.execute("DROP TABLE IF EXISTS BattleData;")

# Create tables
cursor.execute("CREATE TABLE BattleData ( start_month INTEGER, end_month INTEGER, country TEXT, name TEXT, sidebar_text TEXT, PRIMARY KEY (name));")

# Commit changes
db_connection.commit()

# Read all lines from battle data file
file = open("battle_data.txt", 'r')
lines = file.read().splitlines()
file.close()

# Split into 4-line sublists for each battle
battles = [lines[i : i + 4] for i in range(0, len(lines), 4)]

for battle in battles:

    # Unpack list
    name, start_month, end_month, country = battle

    # Convert dates to integers
    start_date = datetime.strptime(start_month, "%d %B %Y")
    start_month_int = ((start_date.year * 12) + start_date.month) - 22976

    end_date = datetime.strptime(end_month, "%d %B %Y")
    end_month_int = ((end_date.year * 12) + end_date.month) - 22976

    sidebar_text = "{}, {}".format(name, country)

    # Add row to database
    cursor.execute("INSERT INTO BattleData VALUES (?, ?, ?, ?, ?);", [start_month_int, end_month_int, country, name, sidebar_text])

# Commit changes to database
db_connection.commit()

# Initialize battle data dictionary
data = {}
for i in range(0, 85):
    data[str(i)] = []

# Get battle data from database
cursor.execute("SELECT * FROM BattleData;")

# Iterate through all battles, adding them to the battle data dictionary
for row in cursor:

    # Unpack row
    start_month, end_month, country, name, sidebar_text = row

    # Create datapoint dictionary
    datapoint = {
        "country"      : country,
        "name"         : name,
        "sidebar_text" : sidebar_text
    }

    # Add datapoint to appropriate list in the battle data dictionary
    data[str(start_month)].append(datapoint)

    if start_month != end_month:
        data[str(end_month)].append(datapoint)

# Close connection to database
db_connection.close()

# Dump battle data dictionary to json file
with open("battledata.json", 'w') as outfile:  
    json.dump(data, outfile)

# # Pretty print json file
# with open("battledata.json", 'r') as handle:
#     parsed = json.load(handle)
#     print(json.dumps(parsed, indent=4, sort_keys=True))
# handle.close()
