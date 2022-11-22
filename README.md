# RESTful-API
## SQL Database Information: 

- Codes: 
  1. Code (INTEGER) - crime incident type numeric code
  2. incident_type (TEXT) - crime incident type description
- Neighborhoods:
  1. neighborhood_number (INTEGER) - neighborhood id
  2. neightborhood_name (TEXT) - neighborhood name
- Incidents: 
  1. case_number (TEXT): unique id from crime case
  2. date_time (DATETIME): date and time when incident took place
  3. code (INTEGER): crime incident type numeric code
  4. incident (TEXT): crime incident description (more specific than incident_type)
  5. police_grid (INTEGER): police grid number where incident occurred
  6. neighborhood_number (INTEGER): neighborhood id where incident occurred
  7. block (TEXT): approximate address where incident occurred

## Assignment TODO List
### Implement the following to earn 30/40 points (Grade: C)
- Package.json
    - [x] Fill out the author and contributors sections in package.json (author should be whoever's   
       GitHub account is used to host the code, contributors should be all group members)
    - [x] Fill out the URL of the repository
    - [x] Ensure all used modules downloaded via NPM are in the dependencies object
    - [x] Ensure that the "node_modules" folder is not included on your GitHub repository
- Add the following routes for your API 
    - [ ] GET /codes
       - Return JSON array with list of codes and their corresponding incident type (ordered by   
         code number)
       - Example: 
       ``` JSON
              [
               {"code": 110, "type": "Murder, Non Negligent Manslaughter"},
               {"code": 120, "type": "Murder, Manslaughter By Negligence"},
               {"code": 210, "type": "Rape, By Force"},
               {"code": 220, "type": "Rape, Attempt"},
               {"code": 300, "type": "Robbery"},
               {"code": 311, "type": "Robbery, Highway, Firearm"},
               {"code": 312, "type": "Robbery, Highway, Knife or Cutting Instrument"},
               {"code": 313, "type": "Robbery, Highway, Other Dangerous Weapons"},
               {"code": 314, "type": "Robbery, Highway, By Strong Arm"},
               ...
              ]
       ```
    - [ ] GET /neighorhoods
       - Return JSON object with list of neightborhood ids and their corresponding neightborhood 
         name (ordered by id)
       - Example: 
       ``` JSON 
       [
         {"id": 1, "name": "Conway/Battlecreek/Highwood"},
         {"id": 2, "name": "Greater East Side"},
         {"id": 3, "name": "West Side"},
         {"id": 4, "name": "Dayton's Bluff"},
         {"id": 5, "name": "Payne/Phalen"},
         {"id": 6, "name": "North End"},
         {"id": 7, "name": "Thomas/Dale(Frogtown)"},
         {"id": 8, "name": "Summit/University"},
         {"id": 9, "name": "West Seventh"},
         {"id": 10, "name": "Como"},
         {"id": 11, "name": "Hamline/Midway"},
         {"id": 12, "name": "St. Anthony"},
         {"id": 13, "name": "Union Park"},
         {"id": 14, "name": "Macalester-Groveland"},
         {"id": 15, "name": "Highland"},
         {"id": 16, "name": "Summit Hill"},
         {"id": 17, "name": "Capitol River"}
       ]
       ```
    - [X] GET /incidents
       - Return JSON object with list of crime incidents (ordered by date/time). Note date and   
          time should be separate fields
       - NEED TO REFACTOR CODE...
       - Example: 
       ``` JSON
       [
          {
            "case_number": "19245020",
            "date": "2019-10-30",
            "time": "23:57:08",
            "code": 9954,
            "incident": "Proactive Police Visit",
            "police_grid": 87,
            "neighborhood_number": 7,
            "block": "THOMAS AV  & VICTORIA"
         },
         {
            "case_number": "19245016",
            "date": "2019-10-30",
            "time": "23:53:04",
            "code": 9954,
            "incident": "Proactive Police Visit",
            "police_grid": 87,
            "neighborhood_number": 7,
            "block": "98X UNIVERSITY AV W"
         },
         {
            "case_number": "19245014",
            "date": "2019-10-30",
            "time": "23:43:19",
            "code": 700,
            "incident": "Auto Theft",
            "police_grid": 95,
            "neighborhood_number": 4,
            "block": "79X 6 ST E"
        },
         ...
       ]
       ```
    - [X] PUT /new-incident
       - Upload incident data to be inserted into the SQLite3 database
       - Data fields: case_number, date, time, code, incident, police_grid, neighborhood_number, block
       NOTE: response should reject (status 500) if the case number already exists in the database
    - [X] DELETE /remove-incident
       - Remove data from the SQLite3 database
       - Data fields: case_number
       NOTE: response should reject (status 500) if the case number does not exist in the database
### Implement Following to features to earn a B or A
- [ ] Add the following query option for GET /codes (2pts)
    - code - comma separated list of codes to include in result. 
    ``` ?code=110, 700```
    - By default all codes should be included
- [ ] Add the following query options for GET /neighborhood (2pts)
    - id - comma separated list of neighborhood numbers to include in result 
    ``` ?id=11, 14```
    - By default all neighborhoods should be included
- [X] Add the following query options for GET /incidents (6pts)
    - start_date - first date to include in results ``` ?start_date=2019-09-01 ```
    - end_date - last date to include in results ``` ?end_date=2019-10-31 ```
    - code - comma separated list of codes to include in result ``` ?code=110,700 ``` 
          By default all codes should be included.
    - grid - comma separated list of police grid numbers to include in result ``` ?grid=38,65 ```         By default all police grids should be included.
    - neighborhood - comma separated list of neighborhood numbers to include in result 
    ``` ?neighborhood=11,14 ``` By default all neighborhoods should be included.
    - limit - maximum number of incidents to include in result ``` ?limit=50 ``` 
    By default the limit should be 1,000. Result should include the N most recent incidents (within     specified date range).


### Query that may help in project from 11/18/2022 Class Period
``` SQL 
SELECT * FROM Incidents ORDER BY date-time DESC LIMIT 50;
``` 
- The above SQL statement limits to first 50 results returned from the Incidents table where they are ordered in descending order by the date attribute. 

- Formatted JSON for PUT Testing: 
   ```
      "{\"case_number\": \"19245014\", \"date\\": \"2019-10-30\",\"time\": \"23:43:19\",\"code\": 700,\"incident\": \"Auto Theft\",\"police_grid\": 95,\"neighborhood_number\": 4,\"block\": \"79X 6 ST E\"}"
   ```