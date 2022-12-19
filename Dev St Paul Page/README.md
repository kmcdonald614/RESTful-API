# Dynamic Web Application

## Implement the following to earn 45/60 points (grade: C)

 - [X] Show a map using the Leaflet API

    - [X] Pan and zoom available with mouse click-and-drag and scroll wheel interaction
    - [X] Limit pan and zoom so map does not display regions outside of St. Paul
        HINT: zoom levels 11-18 are good
        NOTE: this is already the default setup in the starter code!
    - [X] Have an input box and 'Go' button for a user to type a location (lat/  long coordinates, address, etc.)
    - [X] Implement the method that will use the searchbox or crime table click to update the map
    - [X] Add a map layer that will be cleared when new search is implemented, when someone scrolls
    - [X] Map should update when location is entered and 'Go' button pressed
    - [X] Make sure that previously added marker from search is cleared when a new search is implemented
    - [X] Input box text should update with new location (lat/long coordinates or address) when map is panned/zoomed
    - [X] Summarize and create a function that handles click of map and scoll functions of map when a new marker is placed and where it is placed in relation to the operation that is being selected
        - NOTE: updating once pan/zoom has ended is recommended - constantly updating this during a pan will overwhelm the system
    - [X] Use the Nominatim API (https://nominatim.org/release-docs/develop/api/Overview/ to convert between address and lat/long
    - [X] Clamp input values if lat/long is outside of St. Paul's bounding box
    - [X] Determine how to get current view map bounds and compare that to neighborhood tags location to determine what should be seen in the below table
    - [X] Have all Clicked, Scrolled and Search Bar Markers retrieve the same format of information amenity if it is one other wise street number, street name, zip, city, state, suburb, neighboorhood, latitude and longitude
    - [X] add app.vue code to new main component];
    - [X] add number of total incidents from total 1000 imported in 
- [X] Retrieve data from your St. Paul Crime API
    - [X] By default, include 1,000 most recent crimes in the database
    - [X] Populate a table with one row per crime (use neighborhood_name rather than neighborhood_number, and incident_type rather than code)
    - [X] Update neighborhood tags display based on current location that is seen (use hint above)
        - [X] Table should be ordered with most recent on top 
        - [X] Only show crimes that occurred in neighborhoods visible on the map
            - HINT: get lat/long coordinates for the NW and SE corners of the map to use as the min/max lat/long coordinates
        - [X] Draw markers on the map for each neighborhood
            - [X] Marker should have popup to show the number of crimes committed in that neighborhood - out of total or out of 1000 imported?
    - [X] New Incident upload form
        - [X] Create a user input form for users to add a new crime incident to the database (i.e. submit the PUT request)
        - [X] Ensure all fields are filled out before submitting request, otherwise show some error message
        - [X] Set up API PUT call so data makes it to the database
    - [ ] "About the Project" page
        - [ ] Short bio about each team member (including a photo)
        - [X] Description of the tools (frameworks, APIs, etc.) you used to create the application
        - [ ] Video demo of the application (2 - 4 minutes) - include voiceover
            Can natively embed or upload to YouTube and embed
        - [ ] Six interesting findings that you discovered using your application
- [X] Fill out dependencies in Package.json

## Implement additional features to earn a B or A (5 pts each)

- [ ] Create UI controls to filter crime data
    - [ ] Filter based on the following
        - [X] incident_type: list of checkboxes per incident_type
                OK (in fact recommended) to aggregate similar incident types (e.g. codes 1800 - 1885 are all sub-categories of 'Narcotics')
        - [ ] neighborhood_name: list of checkboxes per neighborhood_name
            date range: select a start and end date (only show crimes between those dates)
        - [ ] time range: select a start and end time (only show crimes that occurred between those times of day)
        - [X] max incidents: select maximum number of incidents to retrieve / show
    - [X] Changing a filter should trigger a new request to the St. Paul Crime API
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

- [X] Add a marker to the map at exact crime location when selected from the table
    - [X] Make marker a different color / icon than the markers for the total crimes per neighborhood
        - have all three be a simple badge icon that are shaded the same colors of the table crimes...
    - [X] Create a popup with date, time, incident, and delete button
    Note addresses are slightly obscured (e.g. '98X UNIVERSITY AV W' or 'THOMAS AV & VICTORIA')
        - [X] For addresses with an 'X' in the address number, you can replace it with a '0' (e.g. '90X UNIVERSITY AV W' would become '980 UNIVERSITY AV W'). Careful not to replace all X's though - there could be an X in the street name!

- [X] Format Badge Image to right size
- [X] Look into map tag adjustment bug -- think have something to do either on leaflet.api side or with layer misconfiguration

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

    - Leaflet.js helpful functions
    clone()	Point	
- Returns a copy of the current point.
- 
- add(<Point> otherPoint)	Point	
- Returns the result of addition of the current and the given points.
- 
- subtract(<Point> otherPoint)	Point	
- Returns the result of subtraction of the given point from the current.
- 
- divideBy(<Number> num)	Point	
- Returns the result of division of the current point by the given number.
- 
- multiplyBy(<Number> num)	Point	
- Returns the result of multiplication of the current point by the given number.
- 
- scaleBy(<Point> scale)	Point	
- Multiply each coordinate of the current point by each coordinate of scale. In linear algebra terms, multiply the point by the scaling matrix defined by scale.
- 
- unscaleBy(<Point> scale)	Point	
- Inverse of scaleBy. Divide each coordinate of the current point by each coordinate of scale.
- 
- round()	Point	
- Returns a copy of the current point with rounded coordinates.
- 
- floor()	Point	
- Returns a copy of the current point with floored coordinates (rounded down).
- 
- ceil()	Point	
- Returns a copy of the current point with ceiled coordinates (rounded up).
- 
- trunc()	Point	
- Returns a copy of the current point with truncated coordinates (rounded towards zero).
- 
- distanceTo(<Point> otherPoint)	Number	
- Returns the cartesian distance between the current and the given points.
- 
- equals(<Point> otherPoint)	Boolean	
- Returns true if the given point has the same coordinates.
- 
- contains(<Point> otherPoint)	Boolean	
- Returns true if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
- 
- toString()	String	
- Returns a string representation of the point for debugging purposes.
- 
- extend(<LatLng> latlng)	this	
- Extend the bounds to contain the given point
- 
- extend(<LatLngBounds> otherBounds)	this	
- Extend the bounds to contain the given bounds
- 
- pad(<Number> bufferRatio)	LatLngBounds	
- Returns bounds created by extending or retracting the current bounds by a given ratio in each direction. For example, a ratio of 0.5 extends the bounds by 50% in each direction. Negative values will retract the bounds.
- 
- getCenter()	LatLng	
- Returns the center point of the bounds.
- 
- getSouthWest()	LatLng	
- Returns the south-west point of the bounds.
- 
- getNorthEast()	LatLng	
- Returns the north-east point of the bounds.
- 
- getNorthWest()	LatLng	
- Returns the north-west point of the bounds.
- 
- getSouthEast()	LatLng	
- Returns the south-east point of the bounds.
- 
- getWest()	Number	
- Returns the west longitude of the bounds
- 
- getSouth()	Number	
- Returns the south latitude of the bounds
- 
- getEast()	Number	
- Returns the east longitude of the bounds
- 
- getNorth()	Number	
- Returns the north latitude of the bounds
- 
- contains(<LatLngBounds> otherBounds)	Boolean	
- Returns true if the rectangle contains the given one.
- 
- contains(<LatLng> latlng)	Boolean	
- Returns true if the rectangle contains the given point.
- 
- intersects(<LatLngBounds> otherBounds)	Boolean	
- Returns true if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
- 
- overlaps(<LatLngBounds> otherBounds)	Boolean	
- Returns true if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
- 
- toBBoxString()	String	
- Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
- 
- equals(<LatLngBounds> otherBounds, <Number> maxMargin?)	Boolean	
- Returns true if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting maxMargin to a small number.
- 
- isValid()	Boolean	
- Returns true if the bounds are properly initialized.

## Notes
tools, frameworks, and libraries used in this project
- Foundation - web page format to fit all screens
- Vue - structure page was built in
- leaflet.js - map
- turf - polygon merge calculation to create border around St. Paul
- nominatim - geolocation data
- Splide - gallery on about page
- jQuery - select dom elements

- https://stackoverflow.com/questions/49881093/vue-js-v-for-doesnt-rerender-content-when-array-changed