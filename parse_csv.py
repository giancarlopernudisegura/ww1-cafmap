# Author : Will Fenton
# Email  : wfenton@ualberta.ca
# Date   : 02/01/2019


import sqlite3
import csv
from datetime import datetime


# Establish connection to database, also creates database if it doesn't already exist
db_connection = sqlite3.connect("./ww1.db")
cursor = db_connection.cursor()

# Drop tables
cursor.execute("DROP TABLE IF EXISTS SoldierData;")
cursor.execute("DROP TABLE IF EXISTS CountryMonth;")

# Create tables
cursor.execute("CREATE TABLE CountryMonth ( month_int DATE, month_str TEXT, country TEXT, deaths INTEGER, PRIMARY KEY (country, month_int));")
cursor.execute("CREATE TABLE SoldierData ( id INTEGER, name TEXT, age INTEGER, date_of_death DATE, month INTEGER, month_str TEXT, country TEXT, regiment TEXT, cemetary TEXT, battalion TEXT, PRIMARY KEY (id));")

# Commit changes
db_connection.commit()

# Read rows from csv file
with open("data.csv", "r") as csvfile:
    reader = csv.DictReader(csvfile)

    # Iterate through rows, adding each datapoint to a sqlite database
    for row in reader:

        soldier_id = row["id"]

        name = row["forename"] + ' ' + row["surname"]
        
        age = row["age_text"]
        if not isinstance(age, int):
            age = -1

        # Get date of death, convert to a month number starting at 0 in July 1914 (start of World War I)
        date = datetime.strptime(row["date_of_death"], "%d/%m/%Y")
        month_number = ((date.year * 12) + date.month) - 22976

        month_string = datetime.strftime(date, "%B %Y")

        # Change names of some countries
        country = row['country']
        if country == "Ireland, Republic of":
            country = "Ireland"
        elif country == "Russian Federation":
            country = "Russia"
        elif country == "Israel and Palestine (including Gaza)":
            country = "Isreal and Palestine"
        elif country == "Turkey (including Gallipoli)":
            country = "Turkey"

        regiment = row["regiment"]
        cemetery = row["cemeterymemorial"]
        battalion = row["unitshipsquadron"]

        # Insert row to database
        cursor.execute("INSERT INTO SoldierData VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [soldier_id, name, age, date, month_number, month_string, country, regiment, cemetery, battalion])

# Close csv file, commit changes to database
csvfile.close()
db_connection.commit()
    
# Get the number of deaths for each month, for each country
cursor.execute("SELECT month, month_str, country, COUNT(*) FROM SoldierData GROUP BY month, country;")

# Iterate through rows, adding entries to CountryMonth table
for row in cursor.fetchall():

    # Unpack row
	month, month_str, country, count = row

    # Insert new row into CountryMonth table
	cursor.execute("INSERT INTO CountryMonth VALUES (?, ?, ?, ?);", [month, month_str, country, count])

# Commit changes, close connection to database
db_connection.commit()
db_connection.close()
