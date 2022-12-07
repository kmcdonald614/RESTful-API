# Dynamic Web Application

## Implement the following to earn 45/60 points (grade: C)

 - [ ] Show a map using the Leaflet API

    - [X] Pan and zoom available with mouse click-and-drag and scroll wheel interaction
    - [X] Limit pan and zoom so map does not display regions outside of St. Paul
        HINT: zoom levels 11-18 are good
        NOTE: this is already the default setup in the starter code!
    - [X] Have an input box and 'Go' button for a user to type a location (lat/  long coordinates, address, etc.)
    - [X] Implement the method that will use the searchbox or crime table click to update the map
    - [X] Add a map layer that will be cleared when new search is implemented, when someone scrolls
    - [ ] Map should update when location is entered and 'Go' button pressed
    - [X] Make sure that previously added marker from search is cleared when a new search is implemented
    - [ ] Input box text should update with new location (lat/long coordinates or address) when map is panned/zoomed
    - [ ] Summarize and create a function that handles click of map, double click of map, and scoll functions of map when a new marker is placed and where it is placed in relation to the operation that is being selected
        - NOTE: updating once pan/zoom has ended is recommended - constantly updating this during a pan will overwhelm the system
    - [X] Use the Nominatim API (https://nominatim.org/release-docs/develop/api/Overview/ to convert between address and lat/long
    - [ ] Clamp input values if lat/long is outside of St. Paul's bounding box
    - [ ] Determine how to get current view map bounds and compare that to neighborhood tags location to determine what should be seen in the below table
    - [ ] add number of total incidents from total 1000 imported in 
- [ ] Retrieve data from your St. Paul Crime API
    - [X] By default, include 1,000 most recent crimes in the database
    - [X] Populate a table with one row per crime (use neighborhood_name rather than neighborhood_number, and incident_type rather than code)
    - [ ] Update neighborhood tags display based on current location that is seen (use hint above)
        - [X] Table should be ordered with most recent on top 
        - [ ] Only show crimes that occurred in neighborhoods visible on the map
            - HINT: get lat/long coordinates for the NW and SE corners of the map to use as the min/max lat/long coordinates
        - [X] Draw markers on the map for each neighborhood
            - [ ] Marker should have popup to show the number of crimes committed in that neighborhood - out of total or out of 1000 imported?
    - [X] New Incident upload form
        - [X] Create a user input form for users to add a new crime incident to the database (i.e. submit the PUT request)
        - [X] Ensure all fields are filled out before submitting request, otherwise show some error message
        - [X] Set up API PUT call so data makes it to the database
    - [ ] "About the Project" page
        - [ ] Short bio about each team member (including a photo)
        Description of the tools (frameworks, APIs, etc.) you used to create the application
        - [ ] Video demo of the application (2 - 4 minutes) - include voiceover
            Can natively embed or upload to YouTube and embed
        - [ ] Six interesting findings that you discovered using your application
- [X] Fill out dependencies in Package.json

## Implement additional features to earn a B or A (5 pts each)

- [ ] Create UI controls to filter crime data
    - [ ] Filter based on the following
            - [ ] incident_type: list of checkboxes per incident_type
                OK (in fact recommended) to aggregate similar incident types (e.g. codes 1800 - 1885 are all sub-categories of 'Narcotics')
            - [ ] neighborhood_name: list of checkboxes per neighborhood_name
            date range: select a start and end date (only show crimes between those dates)
            - [ ] time range: select a start and end time (only show crimes that occurred between those times of day)
            - [ ] max incidents: select maximum number of incidents to retrieve / show
        - [ ] Changing a filter should trigger a new request to the St. Paul Crime API
            - It's OK to have a separate 'Update' button, so users can change many filters before triggering a new request
    - [X] Style the background color of rows in the table to categorize crimes as "violent crimes" (crimes against another person), "property crimes" (crimes against a person's or business' property), or "other crimes" (anything else)
    - [X] get the code ranges that identify what the crime is - use these to generate colors for above point
    - 100 -> Murder / Homicide
    - 200 -> Rape
    - 300 -> 374 Robbery
    - 400 -> Aggravated Assault
    - 500 -> Burglary
    - 600 -> Theft
    - 800 -> Domestic Assault
    - 900 -> Arson
    - 1400 -> Criminal Damage
    - 1800 -> Drugs 
    - 2619 -> Weapon discharging in city limits
    - 3100 -> Death Investigation
    - 9000 -> police visit/community engagement / foot patrol
    ### organize by following: 
    - violent crimes - 100,200,400,800 - #A44A3F
    - property crimes - 300, 500, 600, 900, 1400 - #D19C1D
    - other crimes - 1400, 1800, 2600, 3100, 9000 - #32936F
        - [X] You can categorize as you see fit - here's a link with more info to help though: https://www.justia.com/criminal/offenses/ 
    - [X] Also include a legend for the colors

- [X] Add a 'delete' button for each crime in the table
    - Clicking this button should submit a DELETE request to remove the incident from the database

- [ ] Add a marker to the map at exact crime location when selected from the table
    - [ ] Make marker a different color / icon than the markers for the total crimes per neighborhood
        - have all three be a simple badge icon that are shaded the same colors of the table crimes...
    - [ ] Create a popup with date, time, incident, and delete button
    Note addresses are slightly obscured (e.g. '98X UNIVERSITY AV W' or 'THOMAS AV & VICTORIA')
        - [X] For addresses with an 'X' in the address number, you can replace it with a '0' (e.g. '90X UNIVERSITY AV W' would become '980 UNIVERSITY AV W'). Careful not to replace all X's though - there could be an X in the street name!

- [ ] Format Badge Image to right size

## Tools Used
 - https://10015.io/tools/css-background-pattern-generator
 - https://coolors.co/d5dbd8-586ba4-ff934f-3f826d-957964
 - https://coolors.co/d5dbd8-586ba4-32936f-a44a3f-d19c1d
 - https://www.schemecolor.com/google-map-basic-colors.php
 - 

 ## Helpful Things to Know
 ```
 npm run dev -- --port 5500
 ```
 - To add CORS to server.js so communication will work between API and 
    website: https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/
To run Rest API and Dev environment: 
    - First you need to open two separate visual studio windows -- one for the website and the other for the St. Paul RESTApi
    - Second you need to launch both projects in their respective windows
    (NOTE: make sure they are on different ports)
    - As long as both are running they should be set up so they can talk with each other -- CORS code added to top of server.js