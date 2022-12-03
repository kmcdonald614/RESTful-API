<script>
import $ from 'jquery'
import NewIncident from './components/NewIncident.vue';
import About_Page from './components/About.vue'

export default {
    data() {
        return {
            view: "map",
            codes: [],
            neighborhoods: [],
            incidents: [],
            searchData: "",
            leaflet: {
                map: null,
                center: {
                    lat: 44.955139,
                    lng: -93.102222,
                    address: ""
                },
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
        insertNewIncident(data) {
            // API Database PUT Call will happen here where I will create a URL
            // created from the elements in the data
            // use uploadJSON
            // method = PUT
            // url --> https://localhost:8000/new-incident
            console.log(data)
            let url = 'Access-Control-Allow-Orgin: http://localhost:8000/new-incident'
            // this.uploadJSON('PUT', url, data).this((data) => 
            // console.log(data)).catch((err) => console.log(err));
            // this.getJSON('http://localhost:8000/codes').then((data) => console.log(data))
            // .catch((err) => console.log(err))
        }, 
        submitSearch() {
            // This method will handle the following: 
            /*
            take the data from searchData and use it to determine 
            address, lat/lon or other information that will allow us to 
            update the map

            This method will also retrieve the most recent 1000 elements 
            and put them into a table that will be generated under the map
            */
            console.log(this.searchData)
        }
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
            });
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
      <li class="menu-text"><img src="../images/police-badge.png" alt=""> St. Paul, Minnesota Crime Reports</li>
    </ul>
  </div>
  <div class="top-bar-right">
    <ul class="menu">
      <!-- <li><input type="search" placeholder="Search"></li>
      <li><button type="button" class="button">Search</button></li> -->
      <li><p :class="'cell small-4 ' + ((view === 'map') ? 'selected' : 'unselected')" @click="viewMap">Map</p></li>
        <li><p :class="'cell small-4 ' + ((view === 'new_incident') ? 'selected' : 'unselected')" @click="viewNewIncident">New Incident</p></li>
        <li><p :class="'cell small-4 ' + ((view === 'about') ? 'selected' : 'unselected')" @click="viewAbout">About</p></li>
    </ul>
  </div>
</div>
<br>
    <div v-show="view === 'map'">
        <div class="grid-container">
            <div class="grid-x">
                <div class="large-1 medium-1 small-0 cell buffer"></div>
                <div class="large-10 medium-10 small-12 cell search_format"> 
                        <input v-model="searchData" type="text" id="textbox_format" placeholder="e.g. 2115 Summit Avenue" required>
                        <button type="button" class="button" @click="submitSearch">Search</button>
                </div>
                <div class="large-1 medium-1 small-0 cell buffer"></div>
                <div class="large-12 medium-12 small-12 cell" style="height: 5px;"></div>
                <div class="large-1 medium-1 small-0 cell buffer"></div>
                <div id="leafletmap" class="large-10 medium-10 small-12 cell"></div>
                <div class="large-1 medium-1 small-0 cell buffer"></div>
            </div>
        </div>
    </div>
    <div v-if="view === 'new_incident'">
        <NewIncident @incident_data_insert="insertNewIncident"/>
    </div>
    <div v-if="view === 'about'">
        <About_Page/>
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

.search_format {
    display:flex;
}

img {
    height: 20px;
    margin: auto; 
}

.buffer {
    /* background-color: red; */
}
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
