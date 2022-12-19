<script>
import * as turf from '@turf/turf';
// Import toRaw element to get to 'original' map value
// for tag updates
import { toRaw } from 'vue';
export default {
    props: {
        formCondition: false
    },
    watch: {
        formCondition() {
            //console.log(this.formCondition)
            // If true then repopulate the data
            if (this.formCondition == true) {
                this.tableData = [];
                this.headerData = [];
                this.getData('', '', '');
            }
        }
    },
    data() {
        return {
            newStartDate: [],
            newEndDate: [],
            codes: [],
            neighborhoods: [],
            incidents: [],
            headerData: [],
            tableData: [],
            searchData: "",
            totalCrimes: [],
            boundary: [],
            neighborhoodMergePoly: [],
            leaflet: {
                map: null,
                center: {
                    lat: 44.955139,
                    lng: -93.102222,
                    address: ""
                },
                searchMarker: null,
                zoom: 12,
                bounds: {
                    nw: { lat: 45.008206, lng: -93.217977 },
                    se: { lat: 44.883658, lng: -92.993787 }
                },
                neighborhood_markers: [
                    { location: [44.942068, -93.020521], marker: null },
                    { location: [44.977413, -93.025156], marker: null },
                    { location: [44.931244, -93.079578], marker: null },
                    { location: [44.956192, -93.060189], marker: null },
                    { location: [44.978883, -93.068163], marker: null },
                    { location: [44.975766, -93.113887], marker: null },
                    { location: [44.959639, -93.121271], marker: null },
                    { location: [44.9477, -93.128505], marker: null },
                    { location: [44.930276, -93.119911], marker: null },
                    { location: [44.982752, -93.14791], marker: null },
                    { location: [44.963631, -93.167548], marker: null },
                    { location: [44.973971, -93.197965], marker: null },
                    { location: [44.949043, -93.178261], marker: null },
                    { location: [44.934848, -93.176736], marker: null },
                    { location: [44.913106, -93.170779], marker: null },
                    { location: [44.937705, -93.136997], marker: null },
                    { location: [44.949203, -93.093739], marker: null }
                ]
            }, 
            maxResultset: null,
            check100: null, 
            check200: null, 
            check300: null, 
            check400: null, 
            check500: null, 
            check600: null, 
            check800: null, 
            check900: null, 
            check1400: null, 
            check1800: null, 
            check2619: null, 
            check3100: null, 
            check9000: null 
        }
    },
    methods: {
        getJSON(url) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    dataType: "json",
                    url: url,
                    success: (response) => {
                        resolve(response);
                    },
                    error: (status, message) => {
                        reject({ status: status.status, message: status.statusText });
                    }
                });
            });
        },
        uploadJSON(method, url, data) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: method,
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(data),
                    dataType: "text",
                    success: (response) => {
                        resolve(response);
                    },
                    error: (status, message) => {
                        console.log(status, message)
                        reject({ status: status.status, message: status.statusText });
                    }
                });
            });
        },
        customMapTag(color, marker_name) {
            const cssStyle = `
                background-color: ${color};
                width: 1.75rem;
                height: 1.75rem;
                display: block;
                left: -1rem;
                top: -0.5rem;
                position: relative;
                border-radius: 4rem 4rem 0;
                transform: rotate(45deg);
                border: 1px solid #FFFFFF`
            const icon = L.divIcon({
                className: "custom marker",
                iconAnchor: [0, 24],
                labelAnchor: [-6, 0],
                popupAnchor: [0, -36],
                html: `<span id="${marker_name}" style="${cssStyle}" />`
            })
            return icon;
        },
        getAddress(lat, lng, callback) {                     //<value>,…,…,&<params>
            this.getJSON(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                .then((data) => {
                    let messageArr = "";
                    this.updateSearchBar(data);
                    if (data != null || data != undefined) {
                        for (let key in data.address) {
                            if (key != 'ISO3166-2-lvl4' && key != 'country_code') {
                                messageArr += `${key.slice(0, 1).toUpperCase() + key.slice(1)}: ${data.address[key]} <br>`;
                            }
                        }
                    }
                    messageArr += `Latitude: ${lat} <br> Longitude: ${lng}`;
                    callback(messageArr)
                })
        },
        submitSearch() {
            let selectElement = document.querySelector('#search-condition');
            let output = selectElement.options[selectElement.selectedIndex].value;
            if (output == 'Address') {
                // console.log('check address')
                this.getJSON(`https://nominatim.openstreetmap.org/search?q='${this.searchData}, St. Paul, 
                 Minnesota'&format=json&limit=1&accept-language=en&countrycodes=us`)
                    .then((data) => {
                        let lat = data[0].lat
                        let lng = data[0].lon
                        this.getAddress(lat, lng, (addressData) => {
                            if (lat != undefined || lng != undefined) {
                                let coords = [lat, lng];
                                let message = this.markerPopUp([`${addressData}`]);
                                this.createMarker(message, coords, '#708ce0', 'Search');
                                toRaw(this.leaflet.map).flyTo(coords, 14);
                            }
                        });
                    })
                    .catch((err) => {
                        console.log(err)
                        alert("That location is either outside of St. Paul or not available...")
                    })
            } else {
                let value = this.searchData.replace(/[\(\)]/g, '').split(',');
                let lat = parseFloat(value[0]);
                let lng = parseFloat(value[1]);
                //console.log(lat, lng)
                this.getAddress(lat, lng, (addressData) => {
                    if (lat != undefined || lng != undefined) {
                        let coords = [lat, lng];
                        let message = this.markerPopUp([`${addressData}`]);
                        this.createMarker(message, coords, '#708ce0', 'Search');
                        toRaw(this.leaflet.map).flyTo(coords, 14);
                    }
                })
            }
        },
        getData(codesQuery, hoodQuery, incidentQuery) {
            let codeHTTP = `http://localhost:8000/codes?${codesQuery}`;
            let hoodHTTP = `http://localhost:8000/neighborhoods?${hoodQuery}`;
            let incidentHTTP = `http://localhost:8000/incidents?${incidentQuery}`;
            Promise.all([this.getJSON(codeHTTP), this.getJSON(hoodHTTP), this.getJSON(incidentHTTP)])
                .then((data) => {
                    [this.codes, this.neighborhoods, this.incidents] = [data[0], data[1], data[2]];
                    if (this.tableData.length == 0) {
                        this.getIncidentsMetaData(data[2][0])
                        this.countIncidents(() => {
                            this.addNeighborhoodTags();
                        });
                    }
                    this.tableData = this.incidents;
                    this.tableData = this.incidents.map((element) => {
                        let code = element.code;
                        let neighborhood_number = element.neighborhood_number;
                        let block = element.block;
                        let updateVal = element;
                        updateVal = this.mergeCrimeDesc(code, updateVal);
                        updateVal = this.mergeNeighborhood(neighborhood_number, updateVal);
                        // let blockArray = block.split(' ');
                        updateVal.block = this.replaceX(block.split(' '));
                        return updateVal;
                    })
                })
                .catch((err) => {
                    console.log(err)
                    alert("Error loading the data, please refresh your page...")
                })
        },
        countIncidents(callback) {
            this.totalCrimes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            this.incidents.forEach((key, value) => {
                this.totalCrimes[key.neighborhood_number] = this.totalCrimes[key.neighborhood_number] + 1;
            });
            callback();
        },
        mergeCrimeDesc(code, updateVal) {
            if (code != null || code != undefined) {
                for (let index in this.codes) {
                    let codeVal = this.codes[index].code;
                    if (codeVal === code) {
                        updateVal.crimeDesc = this.codes[index].incident_type;
                        break;
                    }
                }
            }
            return updateVal;
        },
        mergeNeighborhood(neighborhood_number, updateVal) {
            if (neighborhood_number != null || neighborhood_number != undefined) {
                if (neighborhood_number >= 1 && neighborhood_number <= 17) {
                    updateVal.neighborhood_name = this.neighborhoods[neighborhood_number - 1].neighborhood_name;
                } else {
                    updateVal.neighborhood_name = ''
                }
            }
            return updateVal;
        },
        replaceX(blockArray) {
            // check for number in blockArray[0]
            if (/\d/.test(blockArray[0]) == true || blockArray[0] == 'X' || blockArray[0] == 'XX'
                || blockArray[0] == 'XXX' || blockArray[0] == 'XXXX' || blockArray[0] == 'XXXXX') {
                // replace Xs with 0s in blockArray[0] 
                blockArray[0] = `${blockArray[0].replaceAll('X', '0')}`
            }
            return blockArray.join(' ');
        },
        getIncidentsMetaData(tuple) {
            for (let key in tuple) {
                if (key == 'neighborhood_number') {
                    key = 'neighborhood_name'
                }
                if (key == 'code') {
                    key = 'Description'
                }
                let metaArr = key.split('_')
                for (let element in metaArr) {
                    let val = metaArr[element];
                    metaArr[element] = val.slice(0, 1).toUpperCase() + val.slice(1);
                }
                key = metaArr.join(' ');
                this.headerData.push(key)
            }
        },
        deleteRecord(case_number, index, color) {
            if ((color == '#A44A3F' || color == '#D19C1D' || color == '#32936F') && this.leaflet.searchMarker != null) {
                toRaw(this.leaflet.map).removeLayer(toRaw(this.leaflet.searchMarker))
                this.leaflet.searchMarker = null;
            }
            let url = "http://localhost:8000/remove-incident"
            this.uploadJSON("DELETE", url, { case_number: case_number }).then((data) => {
                // this.tableData.splice(index, 1);
                const $table = $('table');
                // Select the row you want to remove (assuming it has an id of "row-123")
                const $row = $table.find(`#${index}`);
                // Remove the row
                $row.remove();
                this.scrollToTop();
                alert("The record has been deleted...");
            })
                .catch((err) => {
                    this.scrollToTop();
                    alert("The record does not exist or has already been deleted.")
                })
        },
        clampOutOfBounds(coords) {
            let pointX = coords.lng;
            let pointY = coords.lat;
            let leastDistance = null;
            let distanceIndex = -1;
            for (let i = 0; i < this.neighborhoodMergePoly.geometry.coordinates[0].length; i++) {
                let currCoords = this.neighborhoodMergePoly.geometry.coordinates[0][i];
                let currX = currCoords[0]
                let currY = currCoords[1]
                let distance = Math.sqrt((Math.pow(pointX - currX, 2)) + (Math.pow(pointY - currY, 2)));
                if (leastDistance === null) leastDistance = distance;
                if (distance < leastDistance) {
                    leastDistance = distance;
                    distanceIndex = i;
                }
            }
            let newCoords = this.neighborhoodMergePoly.geometry.coordinates[0][distanceIndex];
            coords = { lat: newCoords[1], lng: newCoords[0] }
            return coords;
        },
        markerchanger(element, index, type) {
            let color = '';
            //Create the marker with the appropriate color based on the type of crime.
            if (element.code >= 0 && element.code <= 299 || element.code >= 400 && element.code <= 499 || element.code >= 800 && element.code <= 899) {
                color = '#A44A3F'
            } else if (element.code >= 300 && element.code <= 399 || element.code >= 500 && element.code <= 699 || element.code >= 900 && element.code <= 999 || element.code >= 1400 && element.code <= 1499) {
                color = '#D19C1D'
            } else {
                color = '#32936F'
            }
            if (type == 'table') {
                this.deleteRecord(element.case_number, index, color);
                return;
            }
            let elementArr = element.block.split(' ');
            for (let element in elementArr) {
                let value = elementArr[element];
                if (value == 'AND') {
                    elementArr = elementArr.slice(0, element);
                    console.log(elementArr)
                    break;
                }
                switch (value) {
                    case 'LNDG':
                        elementArr[element] = 'Lane'
                        break;
                    case 'AVE':
                        elementArr[element] = 'Avenue'
                        break;
                    case 'ST':
                        elementArr[element] = 'Street'
                        break;
                    case 'PL':
                        elementArr[element] = 'Place'
                        break;
                    case 'W':
                        elementArr[element] = 'West'
                        break;
                    case 'N':
                        elementArr[element] = 'North'
                        break;
                    case 'E':
                        elementArr[element] = 'East'
                        break;
                    case 'S':
                        elementArr[element] = 'South'
                        break;
                    case 'DR':
                        elementArr[element] = 'Drive'
                        break;
                    case 'PKWY':
                        elementArr[element] = 'Parkway'
                        break;
                    case 'R':
                        elementArr[element] = 'Road'
                        break;
                    case '00':
                        elementArr[element] = ''
                        break;
                    case '0':
                        elementArr[element] = ''
                        break;
                    case '000':
                        elementArr[element] = ''
                        break;
                    case 'STPAUL':
                        elementArr[element] = 'St. Paul'
                        break;
                    default:
                    // nothing
                }
            }
            let search = elementArr.join(' ');
            this.getJSON(`https://nominatim.openstreetmap.org/search?q='${search}, St. Paul, 
                 Minnesota'&format=json&limit=1&accept-language=en&countrycodes=us`)
                .then((data) => {
                    if (data.length == 0) {
                        alert("Sorry, at this time we cannot locate that incident on the map. Please try again later.")
                        return;
                    }
                    //get the coordinates of the crime incident at the selected block
                    let lng = data[0].lon;
                    let lat = data[0].lat;
                    let coords = [lat, lng];
                    let paragraph = document.createElement('p');
                    let span = document.createElement('span');
                    span.innerHTML = `<strong>Block: ${element.block}</strong> <br>
                                 Date: ${element.date} <br>
                                 Time: ${element.time} <br>
                                 Incident: ${element.incident} <br>`;
                    var button = document.createElement('button');
                    paragraph.appendChild(span);
                    paragraph.appendChild(button);
                    button.innerHTML = 'DELETE';
                    //message to pop up after clicking on block(should display date,time,incident, and a delete button)
                    let message = this.markerPopUp([`Date: ${element.date}`, `Time: ${element.time}`, `Incident: ${element.incident}`]);
                    message = paragraph;
                    this.createMarker(message, coords, color, 'Search');
                    button.addEventListener('click', () => {
                        this.deleteRecord(element.case_number, index, color);
                    })
                    toRaw(this.leaflet.map).flyTo(coords, 14);
                    this.searchData = element.block;
                    this.scrollToTop();
                })
        },
        onMapAction(data) {
            let coords = null;
            if (data == 'getcenter') {
                coords = toRaw(this.leaflet.map).getCenter();
            } else {
                coords = data.latlng;
                toRaw(this.leaflet.map).flyTo(coords, 14);
            }
            if (this.markerInNeighborhood(coords) === undefined) {
                coords = this.clampOutOfBounds(coords);
            }
            this.getAddress(coords.lat, coords.lng, (addressData) => {
                if (coords.lat != undefined || coords.lng != undefined) {
                    let message = this.markerPopUp([`<strong>Location Data:</strong>`, `${addressData}`]);
                    this.createMarker(message, coords, '#708ce0', 'Search');
                }
            });
        },
        createMarker(message, coords, markerColor, typeMarker) {
            let marker;
            // console.log(coords)
            if (toRaw(this.leaflet.searchMarker) == null) {
                marker = new L.marker(coords, { icon: this.customMapTag(markerColor, typeMarker), center: false });
                marker._id = 'marker';
                marker.bindPopup(message, { closeButton: true });
                marker.addTo(toRaw(this.leaflet.map));
                if (typeMarker != 'Neighborhood') {
                    this.leaflet.searchMarker = marker;
                }
            } else {
                toRaw(this.leaflet.searchMarker).setPopupContent(message, { closeButton: true });
                toRaw(this.leaflet.searchMarker).setLatLng(coords);
                //console.log(markerColor)
                $('span#Search').css('backgroundColor', markerColor)
            }
        },
        markerPopUp(dataArr) {
            let message = '';
            dataArr.forEach((element) => {
                message += `${element} <br>`;
            })
            return message;
        },
        checkMapBounds(id) {
            let point = L.latLng(toRaw(this.leaflet.neighborhood_markers[id - 1].location));
            let bounds = toRaw(this.leaflet.map).getBounds();
            let north = bounds.getNorth();
            let south = bounds.getSouth();
            let west = bounds.getWest();
            let east = bounds.getEast();
            let latlngs = [[west, north],
            [east, north],
            [east, south],
            [west, south]];
            let polygon = L.polygon(latlngs);
            return this.markerInPolygon(point, polygon.getLatLngs()[0]);
        },
        updateSearchBar(data) {
            if (data.address.leisure != undefined) {
                this.searchData = `${data.address.leisure}`
                $('#search-condition').prop('selectedIndex', 0)
                return;
            } else if (data.address.tourism != undefined) {
                this.searchData = `${data.address.tourism}`
                $('#search-condition').prop('selectedIndex', 0)
                return;
            } else if (data.address.historic != undefined) {
                this.searchData = `${data.address.historic}`
                $('#search-condition').prop('selectedIndex', 0)
                return;
            } else if (data.address.shop != undefined) {
                this.searchData = `${data.address.shop}`
                $('#search-condition').prop('selectedIndex', 0)
                return;
            }
            else if (data.address.building != undefined) {
                this.searchData = `${data.address.building}`
                $('#search-condition').prop('selectedIndex', 0)
                return;
            } else if (data.address.aeroway != undefined) {
                this.searchData = `${data.address.aeroway}`
                $('#search-condition').prop('selectedIndex', 0)
                return;
            } else if (data.address.amenity != undefined) {
                this.searchData = `${data.address.amenity}`
                $('#search-condition').prop('selectedIndex', 0)
                return;
            } else if (data.address.man_made != undefined) {
                this.searchData = `${data.address.man_made}`
                $('#search-condition').prop('selectedIndex', 0)
            } else if (data.address.road != undefined) {
                let streetAdd = data.address.road;
                if (data.address.house_number != undefined) {
                    streetAdd = data.address.house_number + ' ' + streetAdd;
                }
                this.searchData = `${streetAdd}`
                $('#search-condition').prop('selectedIndex', 0)
                return;
            } else {
                this.searchData = `${data.lat}, ${data.lon}`
                $('#search-condition').prop('selectedIndex', 1)
                return;
            }
        },
        addNeighborhoodTags() {
            // Add neighborhood Tags
            $(toRaw(this.leaflet.neighborhood_markers)).each((key, value) => {
                this.getJSON(`http://localhost:8000/neighborhoods?id=${key + 1}`).then((data) => {
                    let message = this.markerPopUp([`<strong>${data[0].neighborhood_name}</strong>`,
                    `Latitude: ${value.location[0]}`, `Longitude: ${value.location[1]}`, `Total Crimes: ${this.totalCrimes[key + 1]}`]);
                    this.createMarker(message, [value.location[0], value.location[1]], '#586ba4', 'Neighborhood');
                })
            })
        },
        markerInPolygon(coords, polygonCoords) {
            // console.log(coords, polygonCoords)
            var polyPoints = polygonCoords;
            var x = coords.lat, y = coords.lng;
            var inside = false;
            for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
                var yi = polyPoints[i].lat, xi = polyPoints[i].lng;
                var yj = polyPoints[j].lat, xj = polyPoints[j].lng;
                var intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        },
        markerInNeighborhood(coords) {
            for (let i = 0; i < this.boundary.length; i++) {
                let polygon = this.boundary[i];
                if (this.markerInPolygon(coords, polygon.getLatLngs()[0]) == true) {
                    for (let j = 0; j < this.neighborhoods.length; j++) {
                        let district = this.neighborhoods[j];
                        if (polygon._id == district.neighborhood_number) {
                            return this.neighborhoods[j]
                        }
                    }
                }
            }
            return undefined;
        },
        bindTableDisplayConditions(element) {
            let returnString = this.checkTableDisplayConditions(element);
            return `${returnString} ${element.neighborhood_number}`;
        },
        checkTableDisplayConditions(element) {
            if (element.code >= 0 && element.code <= 299 || element.code >= 400 && element.code <= 499 || element.code >= 800 && element.code <= 899) {
                return 'violent'
            } else if (element.code >= 300 && element.code <= 399 || element.code >= 500 && element.code <= 699 || element.code >= 900 && element.code <= 999 || element.code >= 1400 && element.code <= 1499) {
                return 'property'
            } else {
                return 'other'
            }
        },
        scrollToTop() {
            const c = document.documentElement.scrollTop || document.body.scrollTop;
            if (c > 0) {
                window.requestAnimationFrame(this.scrollToTop);
                window.scrollTo(0, c - c / 8);
            }
        },
        addFilter(){
            
            let newFilter = 'code=';
            let isFirst = true;
            if(this.check100){
                newFilter += '100'
                isFirst = false;
            }
            if(this.check200){
                if(!isFirst){
                    newFilter += ','    
                }
                newFilter += '200'
                isFirst = false;
            }
            if(this.check300){
                if(!isFirst){
                    newFilter += ','    
                }
                newFilter += '300'
                isFirst = false;
            }
            if(this.check400){
                if(!isFirst){
                    newFilter += ','    
                }
                newFilter += '400'
                isFirst = false;
            }
            if(this.check500){
                if(!isFirst){
                    newFilter += ','    
                }
                newFilter += '500'
                isFirst = false;
            }
            if(this.check600){
                if(!isFirst){
                    newFilter += ','    
                }
                newFilter += '600'
                isFirst = false;
            }
            if(this.check800){
                if(!isFirst){
                    newFilter += ','    
                }
                newFilter += '800'
                isFirst = false;
            }
            if(this.check900){
                if(!isFirst){
                    newFilter += ','    
                }
                newFilter += '900'
                isFirst = false;
            }
            if(this.check1400){
                if(!isFirst){
                    newFilter += ','    
                }
                newFilter += '1400'
                isFirst = false;
            }
            if(this.check1800){
                if(!isFirst){
                    newFilter += ','    
                }
                newFilter += '1800'
                isFirst = false;
            }
            if(this.check2619){
                if(!isFirst){
                    newFilter += ','    
                }
                newFilter += '2619'
                isFirst = false;
            }
            if(this.check3100){
                if(!isFirst){
                    newFilter += ','    
                }
                newFilter += '3100'
                isFirst = false;
            }
            if(this.check9000){
                if(!isFirst){
                    newFilter += ','    
                }
                newFilter += '9000'
                isFirst = false;
            }
            if(!this.maxResultset == null){
                if(isFirst){
                newFilter = 'limit=' + this.maxResultset;
                } else {
                    newFilter += '&limit=' + this.maxResultset;
                }
            } 
            
            // alert(newFilter);
            this.getData('', '', newFilter)
        }
    },
    created() {
        this.getData('', '', '')
    },
    mounted() {
        this.leaflet.map = L.map("leafletmap").setView([this.leaflet.center.lat, this.leaflet.center.lng], this.leaflet.zoom);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            minZoom: 11,
            maxZoom: 18
        }).addTo(this.leaflet.map);
        this.leaflet.map.setMaxBounds([[44.883658, -93.217977], [45.008206, -92.993787]]);
        let district_boundary = new L.geoJson();
        district_boundary.addTo(this.leaflet.map);
        let toMergePolygons = [];
        this.getJSON("/data/StPaulDistrictCouncil.geojson").then((result) => {
            // St. Paul GeoJSON
            $(result.features).each((key, value) => {
                toMergePolygons.push(value)
                district_boundary.addData(value);
                let tempPoly = []
                value.geometry.coordinates[0][0].forEach((element) => {
                    tempPoly.push(element)
                    this.neighborhoodMergePoly.push(element);
                })
                let polygon = L.polygon(tempPoly, { noClip: false });
                polygon._id = value.properties.district;
                this.boundary.push(polygon);
            });
            // create a border polygon that merges all the polygons
            let currPoly = turf.polygon(toMergePolygons[0].geometry.coordinates[0])
            for (let i = 1; i < toMergePolygons.length; i++) {
                let toMerge = turf.polygon(toMergePolygons[i].geometry.coordinates[0])
                let merged = turf.union(currPoly, toMerge);
                currPoly = merged;
            }
            this.neighborhoodMergePoly = currPoly;
            // Initialize Map Events
            this.leaflet.map.on('click', this.onMapAction);
            this.leaflet.map.on('dragend', (data) => this.onMapAction('getcenter'))
            document.getElementById("search-condition").onchange = () => {
                let selectElement = document.querySelector('#search-condition');
                let output = selectElement.options[selectElement.selectedIndex].value;
                if (output == 'Address') {
                    $('#textbox_format').prop('placeholder', "e.g. 2115 Summit Avenue")
                } else {
                    $('#textbox_format').prop('placeholder', "e.g. 44.94116, -93.09406")
                }
            }
            this.leaflet.map.on('moveend', () => {
                for (let i = 1; i <= 17; i++) {
                    if (this.checkMapBounds(i) == false) {
                        $(`.${i}`).css("display", "none");
                    } else {
                        $(`.${i}`).css("display", "");
                    }
                }
            });
        }).catch((error) => {
            console.log("Error:", error);
        });
    }
}
</script>

<template>
    <div class="grid-container">
        <div class="grid-x">
            <div style="height: 20px;"></div>
        </div>
        <div class="grid-x">
            <div class="large-1 medium-1 small-0 cell buffer"></div>
            <div class="large-10 medium-10 small-12 cell search_format">
                <input v-model="searchData" type="text" id="textbox_format" placeholder="e.g. 2115 Summit Avenue"
                    required>
                <select name="search-condition" id="search-condition">
                    <option value="Address">Address</option>
                    <option value="Lat/Lon">Lat/Lon</option>
                </select>
                <button type="button" class="button" @click="submitSearch">Search</button>
            </div>
            <div class="large-1 medium-1 small-0 cell buffer"></div>
            <div class="large-12 medium-12 small-12 cell" style="height: 5px;"></div>
            <div class="large-1 medium-1 small-0 cell buffer"></div>
            <div id="leafletmap" class="large-10 medium-10 small-12 cell"></div>
            <div class="large-1 medium-1 small-0 cell buffer"></div>
        </div>
        <!-- UI insert here -->
        <div>
            <br>
            <form @submit.prevent="addFilter">
                <p>Filter By: </p><br>
                <!-- <input type="checkbox" id="criteria1" name="criteria1">
                <label for="criteria1"> Case Number Range</label> -->

                <!-- Date Criteria -->                
                <label for="startDate">Start Date:</label>
                <input v-model="newStartDate" type="date" id="startDate">
                <br>
                <label for="endDate">End Date:</label>
                <input v-model="newEndDate" type="date" id="endDate">
                
                <hr width="100%">
                <br>
                <label for="maxResultRequest">Maximum Result Count:</label>
                <input v-model="maxResultset" type="text" id="maxResultRequest">

                <hr width="100%">
                <input type="checkbox" id="checkbox100" v-model="check100"/>
                <label for="checkbox100">Murder / Homicide</label>
                
                <input type="checkbox" id="checkbox200" v-model="check200"/>
                <label for="checkbox200">Rape</label>
                
                <input type="checkbox" id="checkbox300" v-model="check300"/>
                <label for="checkbox300">Robbery</label>
                
                <input type="checkbox" id="checkbox400" v-model="check400"/>
                <label for="checkbox400">Aggravated Assault</label>
                
                <input type="checkbox" id="checkbox500" v-model="check500"/>
                <label for="checkbox500">Burglary</label>
                
                <input type="checkbox" id="checkbox600" v-model="check600"/>
                <label for="checkbox600">Theft</label>
                
                <input type="checkbox" id="checkbox800" v-model="check800"/>
                <label for="checkbox800">Domestic Assault</label>
                
                <input type="checkbox" id="checkbox900" v-model="check900"/>
                <label for="checkbox900">Arson</label>
                <br>
                <input type="checkbox" id="checkbox1400" v-model="check1400"/>
                <label for="checkbox1400">Criminal Damage</label>
                
                <input type="checkbox" id="checkbox1800" v-model="check1800"/>
                <label for="checkbox1800">Drugs</label>
                
                <input type="checkbox" id="checkbox2619" v-model="check2619"/>
                <label for="checkbox2619">Weapon discharging in city limits</label>
                
                <input type="checkbox" id="checkbox3100" v-model="check3100"/>
                <label for="checkbox3100">Death Investigation</label>
                
                <input type="checkbox" id="checkbox9000" v-model="check9000"/>
                <label for="checkbox9000">police visit/community engagement / foot patrol</label>
                <br>
                <hr width="100%">
                
                <!-- /incidents?start_date=yyyy-mm-dd&end_date=yyyy-mm-dd&code=110,700&grid=38,65&neighborhood=11,14&limit=15 -->

                <br><br>
                <button type="submit">SUBMIT</button>
                <!-- <button type="button" @click="this.getData('', '', 'start_date=2021-12-1&end_date=2021-12-31');">SUBMIT QUERY</button>  -->
                <button type="button" @click="this.getData('', '', '');">RESET TABLE</button> 
                <!-- <input type="submit" value="Submit Query"> -->
            </form>
        </div>
        
        <div class="grid-x grid-padding-x" style="padding: 15px;">
            <div class="large-12 medium-12 small-12 cell table_format Flipped">
                <div style="padding: 5px;"></div>
                <div class="table-format Content">
                    <table>
                        <tr>
                            <th v-for="elements in headerData">{{
                                    elements.slice(0, 1).toUpperCase() + elements.slice(1)
                            }}</th>
                            <th>Delete</th>
                        </tr>
                        <tr v-for="(element, index) in tableData" :id="index"
                            :class="this.bindTableDisplayConditions(element)">
                            <td>{{ element.case_number }}</td>
                            <td>{{ element.date }}</td>
                            <td>{{ element.time }}</td>
                            <td>{{ element.crimeDesc }}</td>
                            <td>{{ element.incident }}</td>
                            <td>{{ element.police_grid }}</td>
                            <td>{{ element.neighborhood_name }}</td>
                            <!-- make it into a link that will redirect to neighborhood marker -->
                            <td><button @click="this.markerchanger(element, index, 'popup')">{{ element.block
                            }}</button></td>
                            <!-- make it into a link that will redirect map to exact lat and lon location when clicked -->
                            <td><button @click="this.markerchanger(element, index, 'table')">DELETE</button></td>
                        </tr>
                    </table>
                </div>
                <div class="large-12 medium-12 small-12 cell Content color-legend">
                    <div class="color-legend">
                        <p>Violent Crimes:</p>
                        <div class="violent box"></div>
                    </div>
                    <div class="color-legend">
                        <p>Property Crimes:</p>
                        <div class="property box"></div>
                    </div>
                    <div class="color-legend">
                        <p>Other Crimes:</p>
                        <div class="other box"></div>
                    </div>
                </div>
                <div style="padding: 5px;"></div>
            </div>
        </div>
    </div>
</template>

<style>
#search-condition {
    width: 150px;
}
.main_container {
    background: radial-gradient(at bottom right, #d5dbd8 0, #d5dbd8 17.25px, rgba(213, 219, 216, 0.2) 17.25px, rgba(213, 219, 216, 0.2) 34.5px, rgba(213, 219, 216, 0.75) 34.5px, rgba(213, 219, 216, 0.75) 51.75px, rgba(213, 219, 216, 0.25) 51.75px, rgba(213, 219, 216, 0.25) 69px, rgba(213, 219, 216, 0.3) 69px, rgba(213, 219, 216, 0.3) 86.25px, rgba(213, 219, 216, 0.75) 86.25px, rgba(213, 219, 216, 0.75) 103.5px, rgba(213, 219, 216, 0.2) 103.5px, rgba(213, 219, 216, 0.2) 120.75px, transparent 120.75px, transparent 138px), radial-gradient(at top left, transparent 0, transparent 17.25px, rgba(213, 219, 216, 0.2) 17.25px, rgba(213, 219, 216, 0.2) 34.5px, rgba(213, 219, 216, 0.75) 34.5px, rgba(213, 219, 216, 0.75) 51.75px, rgba(213, 219, 216, 0.3) 51.75px, rgba(213, 219, 216, 0.3) 69px, rgba(213, 219, 216, 0.25) 69px, rgba(213, 219, 216, 0.25) 86.25px, rgba(213, 219, 216, 0.75) 86.25px, rgba(213, 219, 216, 0.75) 103.5px, rgba(213, 219, 216, 0.2) 103.5px, rgba(213, 219, 216, 0.2) 120.75px, #d5dbd8 120.75px, #d5dbd8 138px, transparent 138px, transparent 345px);
    background-blend-mode: multiply;
    background-size: 138px 138px, 138px 138px;
    background-color: #586ba4;
}
button {
    padding: 8px;
    background-color: #586ba4;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
}
button:hover {
    background-color: #3d496f;
}
table {
    border-collapse: collapse;
    width: 100%;
}
td,
th {
    border: 1px black solid;
    text-align: center;
    padding: 2px;
}
th {
    background-color: rgb(150, 150, 150);
}
.table_format {
    background-color: rgb(200, 200, 200);
    overflow-x: auto;
}
.violent {
    background-color: #A44A3F;
}
.property {
    background-color: #D19C1D;
}
.other {
    background-color: #32936F;
}
.color-legend {
    display: flex;
    justify-content: space-evenly;
}
.box {
    width: 20px;
    height: 20px;
    border: 1px black solid;
    margin-left: 5px;
}
.Flipped,
.Flipped .Content {
    transform: rotateX(180deg);
    -ms-transform: rotateX(180deg);
    /* IE 9 */
    -webkit-transform: rotateX(180deg);
    /* Safari and Chrome */
}
.search_format {
    display: flex;
}
img {
    height: 20px;
    margin: auto;
}
.buffer {}
#leafletmap {
    height: 500px;
}
.selected {
    background-color: rgb(10, 100, 126);
    color: white;
    /* border: solid 1px white; */
    text-align: center;
    cursor: pointer;
    padding-left: 2rem;
    padding-right: 2rem;
    margin: auto;
}
.unselected {
    background-color: rgb(200, 200, 200);
    color: black;
    /* border: solid 1px white; */
    text-align: center;
    cursor: pointer;
    padding-left: 2rem;
    padding-right: 2rem;
    margin: auto;
}
</style>