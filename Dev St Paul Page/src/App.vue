<script>
import $ from 'jquery'
import NewIncident from './components/NewIncident.vue'
import About_Page from './components/About.vue'

export default {
    data() {
        return {
            view: "map",
            codes: [],
            neighborhoods: [],
            incidents: [],
            headerData: [],
            tableData: [],
            searchData: "",
            formCondition: false,
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
            }
        };
    },
    methods: {
        viewMap(event) {
            this.view = "map";
        },
        viewNewIncident(event) {
            this.view = "new_incident";
        },
        viewAbout(event) {
            this.view = "about";
        },
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
        customMapTag(color) {
            const cssStyle = `
                background-color: ${color};
                width: 1.75rem;
                height: 1.75rem;
                display: block;
                left: -1rem;
                top: -1rem;
                position: relative;
                border-radius: 4rem 4rem 0;
                transform: rotate(45deg);
                border: 1px solid #FFFFFF`
            // NOTE Add image overlay here
            const icon = L.divIcon({
                className: "custom marker",
                iconAnchor: [0, 24],
                labelAnchor: [-6, 0],
                popupAnchor: [0, -36],
                html: `<span style="${cssStyle}" />`
            })
            return icon;
        },
        submitSearch(messageData) {
            
            // This method will handle the following: 
            /*
            take data from search data and retrieve lat and lon values of search
            use this information to determine which neighborhood markers that are visible
                and based on which are visible show the incidents in the below table based
                on what markers are still visible or which neighborhood we are currently in
            also need to make a marker unique for the click
            */

            // https://nominatim.openstreetmap.org/search?q='St. Paul'
            // '&format=json&limit=50&accept-language=en&countrycodes='US'
            if (this.leaflet.searchMarker !== null) {
                this.leaflet.map.removeLayer(this.leaflet.searchMarker);
            }

            // console.log(this.leaflet.bounds.nw)
            // let northLat = this.leaflet.bounds.nw.lat;
            // let westLon = this.leaflet.bounds.nw.lng;
            // let southLat = this.leaflet.bounds.se.lat;
            // let eastLon = this.leaflet.bounds.se.lng;

            this.getJSON(`https://nominatim.openstreetmap.org/search?q='${this.searchData}, St. Paul, Minnesota'&format=json&limit=50&accept-language=en&countrycodes=us`)
                .then((data) => {
                    // need to check if lat and lon are within boundaries otherwise clamp them
                    // compare lat and lon from result and map it to bounds of one of the neighborhoods and map that 
                    //      neighborhood to the dialog box 
                    let lat = data[0].lat
                    let lon = data[0].lon
                    // console.log(lat, lon)
                    // console.log(northLat, southLat, westLon, eastLon)
                    //45.008206, -93.217977
                    // Haskell Street West

                    // if (lat > northLat) {
                    //     lat = northLat
                    // } else if (lat < southLat) {
                    //     lat = southLat
                    // }

                    // if (lon > westLon) {
                    //     lon = westLon
                    // } else if (lon < eastLon) {
                    //     lon = eastLon
                    // }
                    // console.log(lat, lon)
                    let message = ''
                    if (messageData == null) {
                        message =
                        `${data[0].display_name} <br> 
                        Latitude: ${lat} <br> 
                        Longitude: ${lon}`
                    } else {
                        message = `Still Need to set up`
                    }

                    
                    let marker = L.marker([lat, lon], { icon: this.customMapTag('#708ce0') })
                    marker._id = 'marker'
                    this.leaflet.searchMarker = marker;
                    marker.bindPopup(message, { closeButton: true });
                    this.leaflet.map.addLayer(marker)
                    this.leaflet.map.flyTo([lat, lon], 16);
                })
                .catch((err) => {
                    console.log(err)
                    alert("That location is either outside of St. Paul or not available...")
                })
        },
        getData(codesQuery, hoodQuery, incidentQuery) {
            this.getJSON(`http://localhost:8000/codes?${codesQuery}`).then((data) => {
                this.codes = data;
                // console.log(data)
                return this.getJSON(`http://localhost:8000/neighborhoods?${hoodQuery}`)
            }).then((data) => {
                this.neighborhoods = data;
                // console.log(data)
                return this.getJSON(`http://localhost:8000/incidents?${incidentQuery}`)
            }).then((data) => {
                this.incidents = data;
                this.getIncidentsMetaData(data[0])

                // merge all this received data into a single array
                this.tableData = this.incidents;

                this.tableData = this.incidents.map((element) => {

                    let code = element.code;
                    let neighborhood_number = element.neighborhood_number;
                    let block = element.block;
                    let updateVal = element;
                    if (code != null || code != undefined) {
                        for (let index in this.codes) {
                            let codeVal = this.codes[index].code;
                            if (codeVal === code) {
                                updateVal.crimeDesc = this.codes[index].incident_type;
                                break;
                            }
                        }
                    }
                    if (neighborhood_number != null || neighborhood_number != undefined) {
                        if (neighborhood_number >= 1 && neighborhood_number <= 17) {
                            updateVal.neighborhood_name = this.neighborhoods[neighborhood_number - 1].neighborhood_name;
                        } else {
                            updateVal.neighborhood_name = ''
                        }
                    }
                    let blockArray = block.split(' ');
                    // check for number in blockArray[0]
                    if (/\d/.test(blockArray[0]) == true || blockArray[0] == 'X' || blockArray[0] == 'XX'
                        || blockArray[0] == 'XXX' || blockArray[0] == 'XXXX' || blockArray[0] == 'XXXXX') {
                        // replace Xs with 0s in blockArray[0] 
                        blockArray[0] = `${blockArray[0].replaceAll('X', '0')}`
                    }
                    updateVal.block = blockArray.join(' ');

                    return updateVal;
                })
            })
                .catch((err) => {
                    console.log(err);
                    alert("Error loading the data, please refresh your page...")
                })


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
        deleteRecord(case_number, index) {
            let url = "http://localhost:8000/remove-incident"
            this.uploadJSON("DELETE", url, { case_number: case_number }).then((data) => {
                this.tableData.splice(index, 1);
                alert("The record has been deleted...");

            })
                .catch((err) => {
                    alert("The record does not exist or has already beed deleted.")
                })
        },
        checkFormCondition(childData) {
            if (childData == true) {
                this.tableData = []
                this.headerData = []
                this.getData('', '', '')
            }

        },
        onMapClick(e) {
            console.log(e.latlng.lat)
            if (this.leaflet.searchMarker !== null) {
                this.leaflet.map.removeLayer(this.leaflet.searchMarker);
            }
            // need to add query to montemenmim api to get result for lat and lng
            // need to also clamp lat and lng
            let message = `Latitude: ${e.latlng.lat} <br> 
                           Longitude: ${e.latlng.lng}`
            let marker = L.marker(e.latlng, { icon: this.customMapTag('#708ce0') })
            marker._id = 'marker'
            this.leaflet.searchMarker = marker;
            marker.bindPopup(message, { closeButton: true });

            this.leaflet.map.addLayer(marker)
            this.leaflet.map.flyTo(e.latlng, 16);
            this.searchData = `${e.latlng.lat}, ${e.latlng.lng}`
        }, 
        onScroll() {
            // Still need to implement this method or at least its function on the map
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
        this.getJSON("/data/StPaulDistrictCouncil.geojson").then((result) => {
            // St. Paul GeoJSON
            $(result.features).each((key, value) => {
                district_boundary.addData(value);
                // console.log(value)
            });
            $(this.leaflet.neighborhood_markers).each((key, value) => {
                value.marker = L.marker(value.location, { icon: this.customMapTag('#586ba4') }).addTo(district_boundary);
                this.getJSON(`http://localhost:8000/neighborhoods?id=${key + 1}`).then((data) => {
                    value.marker = value.marker.bindPopup(`${data[0].neighborhood_name}
                     ${value.location[0]}, ${value.location[1]}`);
                    // need to determine how to add crime count to these bubbles
                    this.leaflet.map.on('click', this.onMapClick);
                })
                    .catch((err) => {
                        console.log(err)
                    })
            })
        }).catch((error) => {
            console.log("Error:", error);
        });
    },
    components: {
        About_Page,
        NewIncident
    }
}
</script>

<template>
    <div class="main_container">
        <div class="top-bar">
            <div class="top-bar-left">
                <ul class="menu" data-dropdown-menu>
                    <li class="menu-text"><img src="../images/police-badge.png" alt=""> St. Paul, Minnesota Crime
                        Reports</li>
                </ul>
            </div>
            <div class="top-bar-right">
                <ul class="menu">
                    <!-- <li><input type="search" placeholder="Search"></li>
      <li><button type="button" class="button">Search</button></li> -->
                    <li>
                        <p :class="'cell small-4 ' + ((view === 'map') ? 'selected' : 'unselected')" @click="viewMap">
                            Map</p>
                    </li>
                    <li>
                        <p :class="'cell small-4 ' + ((view === 'new_incident') ? 'selected' : 'unselected')"
                            @click="viewNewIncident">New Incident</p>
                    </li>
                    <li>
                        <p :class="'cell small-4 ' + ((view === 'about') ? 'selected' : 'unselected')"
                            @click="viewAbout">About</p>
                    </li>
                </ul>
            </div>
        </div>
        <br>
        <div v-show="view === 'map'">
            <div class="grid-container">
                <div class="grid-x">
                    <div class="large-1 medium-1 small-0 cell buffer"></div>
                    <div class="large-10 medium-10 small-12 cell search_format">
                        <input v-model="searchData" type="text" id="textbox_format"
                            placeholder="e.g. 2115 Summit Avenue" required>
                        <button type="button" class="button" @click="submitSearch(null)">Search</button>
                    </div>
                    <div class="large-1 medium-1 small-0 cell buffer"></div>
                    <div class="large-12 medium-12 small-12 cell" style="height: 5px;"></div>
                    <div class="large-1 medium-1 small-0 cell buffer"></div>
                    <div id="leafletmap" class="large-10 medium-10 small-12 cell"></div>
                    <div class="large-1 medium-1 small-0 cell buffer"></div>
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
                                <tr v-for="(element, index) in tableData"
                                    :class="(element.code >= 0 && element.code <= 299 || element.code >= 400 && element.code <= 499 || element.code >= 800 && element.code <= 899) ? 'violent' :
                                    (element.code >= 300 && element.code <= 399 || element.code >= 500 && element.code <= 699 || element.code >= 900 && element.code <= 999 || element.code >= 1400 && element.code <= 1499) ? 'property' : 'other'">
                                    <td>{{ element.case_number }}</td>
                                    <td>{{ element.date }}</td>
                                    <td>{{ element.time }}</td>
                                    <td>{{ element.crimeDesc }}</td>
                                    <td>{{ element.incident }}</td>
                                    <td>{{ element.police_grid }}</td>
                                    <td>{{ element.neighborhood_name }}</td>
                                    <!-- make it into a link that will redirect to neighborhood marker -->
                                    <td>{{ element.block }}</td>
                                    <!-- make it into a link that will redirect map to exact lat and lon location when clicked -->
                                    <td><button @click="deleteRecord(element.case_number, index)">DELETE</button></td>
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

        </div>
        <div v-if="view === 'new_incident'">
            <NewIncident @subCon="checkFormCondition($event)" />
        </div>
        <div v-if="view === 'about'">
            <About_Page />
        </div>
    </div>
</template>

<style>
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
